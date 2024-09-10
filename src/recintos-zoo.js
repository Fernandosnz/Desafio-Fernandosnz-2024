export class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanho: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanho: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] },
        ];

        this.animaisConfig = {
            'LEAO': { tamanho: 3, bioma: ['savana'], carnivoro: true },
            'LEOPARDO': { tamanho: 2, bioma: ['savana'], carnivoro: true },
            'CROCODILO': { tamanho: 3, bioma: ['rio'], carnivoro: true },
            'MACACO': { tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
            'GAZELA': { tamanho: 2, bioma: ['savana'], carnivoro: false },
            'HIPOPOTAMO': { tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false },
        };
    }

    analisaRecintos(tipoAnimal, quantidade) {
        if (!this.animaisConfig[tipoAnimal]) {
            return { erro: "Animal inválido" };
        }
        
        if (!Number.isInteger(quantidade) || quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const animalInfo = this.animaisConfig[tipoAnimal];
        const recintosViaveis = [];

        this.recintos.forEach((recinto) => {
            if (this.isRecintoViavel(recinto, animalInfo, quantidade)) {
                const espacoLivre = this.calculaEspacoLivre(recinto, animalInfo, quantidade);
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanho})`);
            }
        });

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        return { recintosViaveis };
    }

    isRecintoViavel(recinto, animalInfo, quantidade) {
        const espacoNecessario = this.calculaEspacoNecessario(recinto, animalInfo, quantidade);
        if (espacoNecessario > recinto.tamanho) {
            return false;
        }

        if (!this.biomaCompativel(recinto.bioma, animalInfo.bioma)) {
            return false;
        }

        if (!this.respeitaRegrasCarnivoro(recinto, animalInfo)) {
            return false;
        }

        if (!this.respeitaRegraMacaco(recinto, animalInfo, quantidade)) {
            return false;
        }

        if (!this.regraHipopotamo(recinto, animalInfo, quantidade)) {
            return false;
        }

        return true;
    }

    calculaEspacoNecessario(recinto, animalInfo, quantidade) {
        // Calcula o espaço usado pelos animais existentes
        let espacoUsado = recinto.animais.reduce((acc, animal) => {
            return acc + animal.quantidade * this.animaisConfig[animal.especie].tamanho;
        }, 0);

        // Verifica se o recinto já possui uma espécie diferente
        const especiesDiferentes = recinto.animais.some((animal) => animal.especie !== animalInfo.especie);

        // Adiciona o espaço necessário para os novos animais
        if (especiesDiferentes) {
            // Se houver espécies diferentes, adiciona um espaço extra
            espacoUsado += 1;
        }
        espacoUsado += quantidade * animalInfo.tamanho;

        return espacoUsado;
    }

    calculaEspacoLivre(recinto, animalInfo, quantidade) {
        const espacoNecessario = this.calculaEspacoNecessario(recinto, animalInfo, quantidade);
        return recinto.tamanho - espacoNecessario;
    }

    biomaCompativel(biomaRecinto, biomasAnimal) {
        return biomasAnimal.some((bioma) => biomaRecinto.includes(bioma));
    }

    respeitaRegrasCarnivoro(recinto, animalInfo) {
        if (animalInfo.carnivoro) {
            return recinto.animais.every((animal) => animal.especie === animalInfo.especie);
        }
        return true;
    }

    respeitaRegraMacaco(recinto, animalInfo, quantidade) {
        if (animalInfo.especie === 'MACACO') {
            const totalMacacos = recinto.animais.find((animal) => animal.especie === 'MACACO')?.quantidade || 0;
            return totalMacacos + quantidade >= 2 || recinto.animais.length > 1;
        }
        return true;
    }

    regraHipopotamo(recinto, animalInfo, quantidade) {
        if (animalInfo.especie === 'HIPOPOTAMO') {
            return recinto.bioma === 'savana e rio' || recinto.animais.length === 0;
        }
        return true;
    }
}