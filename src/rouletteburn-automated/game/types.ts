export interface GAME {
    achievements: Achievement[];
    augmentations: Augmentation[];
    bitNodeN: number;
    city: string;
    currentServer: string;
    moneySourceA: {casino: number}
}

type Achievement = {
    ID: string;
    unlockedOn: number;
}

type Augmentation = {
    level: number;
    name: string;
}