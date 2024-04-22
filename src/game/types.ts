export interface GAME {
    achievements: Achievement[];
    augmentations: Augmentation[];
    bitNodeN: number;
    city: string;
    currentServer: string;
    hp: {current: number; max: number};
    purchasedServers: string[];
    scriptProdSinceLastAug: number;
    skills: SkillStats;
    exp: SkillStats
    totalPlaytime: number;
    factions: string[];
    factionRumors: string;
    factionInvitiations: string[];
    focus: boolean;
    focusPenalty(): number;
    has4SData: boolean;
    has4SDataTixApi: boolean;
    hasTixApiAccess: boolean;
    hasTorRouter(): boolean;
    hasWseAccount: boolean;
    getHomeComputer(): Server;
    getCurrentServer(): Server;
    getCasinoWinnings(): number;
    getUpgradeHomeCoresCost(): number;
    getUpgradeHomeRamCost(): number;
    hasJob(): boolean;
    isAwareOfGang(): boolean;
    canAccessGang(): boolean;
    canAccessGrafting(): boolean;
    canAccessCotMG(): boolean;
    canAccessCorporation(): boolean;
    canAccessBladeburner(): boolean;
    hasProgram(program: string): boolean;
    inGang(): boolean;
    karma: number;
    lastAugReset: number;
    lastNodeReset: number;
    lastSave: number;
    lastUpdate: number;
    money: number;
    moneySourceA: MoneySource;
    moneySourceB: MoneySource;
    mults: Mults;
    numPeopleKilled: number;
    playtimeSinceLastAug: number;
    playtimeSinceLastBitnode: number;
    getGangName(): string;
    entropy: number;
}

type Mults = {
    agility: number;
    agility_exp: number;
    bladeburner_analysis: number;
    bladeburner_max_stamina: number;
    bladeburner_stamina_gain: number;
    bladeburner_success_chance: number;
    charisma: number;
    charisma_exp: number;
    company_rep: number;
    crime_money: number;
    crime_success: number;
    defense: number;
    defense_exp: number;
    dexterity: number;
    dexterity_exp: number;
    faction_rep: number;
    hacking: number;
    hacking_chance: number;
    hacking_exp: number;
    hacking_grow: number;
    hacking_money: number;
    hacking_speed: number;
    hacknet_node_core_cost: number;
    hacknet_node_level_cost: number;
    hacknet_node_money: number;
    hacknet_node_purchase_cost: number;
    hacknet_node_ram_cost: number;
    strength: number;
    strength_exp: number;
    work_money: number;
}

type MoneySource = {
    augmentations: number;
    bladeburner: number;
    casino: number;
    class: number;
    codingcontract: number;
    corporation: number;
    crime: number;
    gang: number;
    gang_expenses: number;
    hacking: number;
    hacknet: number;
    hacknet_expenses: number;
    hospitalization: number;
    infiltration: number;
    other: number;
    servers: number;
    sleeves: number;
    stock: number;
    total: number;
    work: number;
}

type Server = {
    serversOnNetwork: string[];
    textFiles: Map<string, File>;
    sshPortOpen: boolean;
    sqlPortOpen: boolean;
    smtpPortOpen: boolean;
    serverGrowth: number;
    scripts: Map<string, File>;
    requiredHackingSkill: number;
    ramUsed: number;
    purchasedByPlayer: boolean;
    programs: string[]
    organizationName: string;
    openPortCount: number;
    numOpenPortsRequired: number;
    moneyMax: number;
    moneyAvailable: number;
    minDifficulty: number;
    message: string[]
    maxRam: number;
    isConnectedTo: boolean;
    ip: string;
    httpPortOpen: boolean;
    hostname: string;
    hasAdminRights: boolean;
    hackDifficulty: number;
    ftpPortOpen: boolean;
    cpuCores: number;
    backdoorInstalled: boolean;
    baseDifficulty: number;
}

type File = {
    filename: string;
    text: string;
}

type SkillStats = {
    agility: number;
    charisma: number;
    defense: number;
    dexterity: number;
    hacking: number;
    intelligence: number;
    strength: number;
}

type Achievement = {
    ID: string;
    unlockedOn: number;
}

type Augmentation = {
    level: number;
    name: string;
}