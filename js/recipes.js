// ============================================================
// recipes.js — CraftQuiz complete recipe database
// ============================================================

const RECIPES = [
  // ─────────────────── WEAPONS ───────────────────
  {
    id: "wooden_sword",
    nameEN: "Wooden Sword",
    nameES: "Espada de Madera",
    sprite: "Wooden_Sword",
    category: "weapons",
    shapeless: false,
    furnace: false,
    grid: [
      [null, "oak_planks", null],
      [null, "oak_planks", null],
      [null, "stick",      null]
    ],
    subRecipes: ["oak_planks", "stick"]
  },
  {
    id: "stone_sword",
    nameEN: "Stone Sword",
    nameES: "Espada de Piedra",
    sprite: "Stone_Sword",
    category: "weapons",
    shapeless: false,
    furnace: false,
    grid: [
      [null, "cobblestone", null],
      [null, "cobblestone", null],
      [null, "stick",       null]
    ],
    subRecipes: ["stick"]
  },
  {
    id: "iron_sword",
    nameEN: "Iron Sword",
    nameES: "Espada de Hierro",
    sprite: "Iron_Sword",
    category: "weapons",
    shapeless: false,
    furnace: false,
    grid: [
      [null, "iron_ingot", null],
      [null, "iron_ingot", null],
      [null, "stick",      null]
    ],
    subRecipes: ["iron_ingot", "stick"]
  },
  {
    id: "golden_sword",
    nameEN: "Golden Sword",
    nameES: "Espada de Oro",
    sprite: "Golden_Sword",
    category: "weapons",
    shapeless: false,
    furnace: false,
    grid: [
      [null, "gold_ingot", null],
      [null, "gold_ingot", null],
      [null, "stick",      null]
    ],
    subRecipes: ["gold_ingot", "stick"]
  },
  {
    id: "diamond_sword",
    nameEN: "Diamond Sword",
    nameES: "Espada de Diamante",
    sprite: "Diamond_Sword",
    category: "weapons",
    shapeless: false,
    furnace: false,
    grid: [
      [null, "diamond", null],
      [null, "diamond", null],
      [null, "stick",   null]
    ],
    subRecipes: ["stick"]
  },
  {
    id: "bow",
    nameEN: "Bow",
    nameES: "Arco",
    sprite: "Bow",
    category: "weapons",
    shapeless: false,
    furnace: false,
    grid: [
      [null,   "stick",  "string"],
      ["stick", null,    "string"],
      [null,   "stick",  "string"]
    ],
    subRecipes: ["stick"]
  },
  {
    id: "crossbow",
    nameEN: "Crossbow",
    nameES: "Ballesta",
    sprite: "Crossbow",
    category: "weapons",
    shapeless: false,
    furnace: false,
    grid: [
      ["stick",      "iron_ingot", "stick"],
      ["string",     "tripwire_hook", "string"],
      [null,         "stick",      null]
    ],
    subRecipes: ["stick", "tripwire_hook"]
  },
  {
    id: "arrow",
    nameEN: "Arrow",
    nameES: "Flecha",
    sprite: "Arrow",
    category: "weapons",
    shapeless: false,
    furnace: false,
    grid: [
      [null, "flint",   null],
      [null, "stick",   null],
      [null, "feather", null]
    ],
    subRecipes: ["stick"]
  },

  // ─────────────────── TOOLS ───────────────────
  {
    id: "wooden_pickaxe",
    nameEN: "Wooden Pickaxe",
    nameES: "Pico de Madera",
    sprite: "Wooden_Pickaxe",
    category: "tools",
    shapeless: false,
    furnace: false,
    grid: [
      ["oak_planks", "oak_planks", "oak_planks"],
      [null,         "stick",      null],
      [null,         "stick",      null]
    ],
    subRecipes: ["oak_planks", "stick"]
  },
  {
    id: "stone_pickaxe",
    nameEN: "Stone Pickaxe",
    nameES: "Pico de Piedra",
    sprite: "Stone_Pickaxe",
    category: "tools",
    shapeless: false,
    furnace: false,
    grid: [
      ["cobblestone", "cobblestone", "cobblestone"],
      [null,          "stick",       null],
      [null,          "stick",       null]
    ],
    subRecipes: ["stick"]
  },
  {
    id: "iron_pickaxe",
    nameEN: "Iron Pickaxe",
    nameES: "Pico de Hierro",
    sprite: "Iron_Pickaxe",
    category: "tools",
    shapeless: false,
    furnace: false,
    grid: [
      ["iron_ingot", "iron_ingot", "iron_ingot"],
      [null,         "stick",      null],
      [null,         "stick",      null]
    ],
    subRecipes: ["iron_ingot", "stick"]
  },
  {
    id: "golden_pickaxe",
    nameEN: "Golden Pickaxe",
    nameES: "Pico de Oro",
    sprite: "Golden_Pickaxe",
    category: "tools",
    shapeless: false,
    furnace: false,
    grid: [
      ["gold_ingot", "gold_ingot", "gold_ingot"],
      [null,         "stick",      null],
      [null,         "stick",      null]
    ],
    subRecipes: ["gold_ingot", "stick"]
  },
  {
    id: "diamond_pickaxe",
    nameEN: "Diamond Pickaxe",
    nameES: "Pico de Diamante",
    sprite: "Diamond_Pickaxe",
    category: "tools",
    shapeless: false,
    furnace: false,
    grid: [
      ["diamond", "diamond", "diamond"],
      [null,      "stick",   null],
      [null,      "stick",   null]
    ],
    subRecipes: ["stick"]
  },
  {
    id: "wooden_axe",
    nameEN: "Wooden Axe",
    nameES: "Hacha de Madera",
    sprite: "Wooden_Axe",
    category: "tools",
    shapeless: false,
    furnace: false,
    grid: [
      ["oak_planks", "oak_planks", null],
      ["oak_planks", "stick",      null],
      [null,         "stick",      null]
    ],
    subRecipes: ["oak_planks", "stick"]
  },
  {
    id: "stone_axe",
    nameEN: "Stone Axe",
    nameES: "Hacha de Piedra",
    sprite: "Stone_Axe",
    category: "tools",
    shapeless: false,
    furnace: false,
    grid: [
      ["cobblestone", "cobblestone", null],
      ["cobblestone", "stick",       null],
      [null,          "stick",       null]
    ],
    subRecipes: ["stick"]
  },
  {
    id: "iron_axe",
    nameEN: "Iron Axe",
    nameES: "Hacha de Hierro",
    sprite: "Iron_Axe",
    category: "tools",
    shapeless: false,
    furnace: false,
    grid: [
      ["iron_ingot", "iron_ingot", null],
      ["iron_ingot", "stick",      null],
      [null,         "stick",      null]
    ],
    subRecipes: ["iron_ingot", "stick"]
  },
  {
    id: "golden_axe",
    nameEN: "Golden Axe",
    nameES: "Hacha de Oro",
    sprite: "Golden_Axe",
    category: "tools",
    shapeless: false,
    furnace: false,
    grid: [
      ["gold_ingot", "gold_ingot", null],
      ["gold_ingot", "stick",      null],
      [null,         "stick",      null]
    ],
    subRecipes: ["gold_ingot", "stick"]
  },
  {
    id: "diamond_axe",
    nameEN: "Diamond Axe",
    nameES: "Hacha de Diamante",
    sprite: "Diamond_Axe",
    category: "tools",
    shapeless: false,
    furnace: false,
    grid: [
      ["diamond", "diamond", null],
      ["diamond", "stick",   null],
      [null,      "stick",   null]
    ],
    subRecipes: ["stick"]
  },
  {
    id: "wooden_shovel",
    nameEN: "Wooden Shovel",
    nameES: "Pala de Madera",
    sprite: "Wooden_Shovel",
    category: "tools",
    shapeless: false,
    furnace: false,
    grid: [
      [null, "oak_planks", null],
      [null, "stick",      null],
      [null, "stick",      null]
    ],
    subRecipes: ["oak_planks", "stick"]
  },
  {
    id: "stone_shovel",
    nameEN: "Stone Shovel",
    nameES: "Pala de Piedra",
    sprite: "Stone_Shovel",
    category: "tools",
    shapeless: false,
    furnace: false,
    grid: [
      [null, "cobblestone", null],
      [null, "stick",       null],
      [null, "stick",       null]
    ],
    subRecipes: ["stick"]
  },
  {
    id: "iron_shovel",
    nameEN: "Iron Shovel",
    nameES: "Pala de Hierro",
    sprite: "Iron_Shovel",
    category: "tools",
    shapeless: false,
    furnace: false,
    grid: [
      [null, "iron_ingot", null],
      [null, "stick",      null],
      [null, "stick",      null]
    ],
    subRecipes: ["iron_ingot", "stick"]
  },
  {
    id: "golden_shovel",
    nameEN: "Golden Shovel",
    nameES: "Pala de Oro",
    sprite: "Golden_Shovel",
    category: "tools",
    shapeless: false,
    furnace: false,
    grid: [
      [null, "gold_ingot", null],
      [null, "stick",      null],
      [null, "stick",      null]
    ],
    subRecipes: ["gold_ingot", "stick"]
  },
  {
    id: "diamond_shovel",
    nameEN: "Diamond Shovel",
    nameES: "Pala de Diamante",
    sprite: "Diamond_Shovel",
    category: "tools",
    shapeless: false,
    furnace: false,
    grid: [
      [null, "diamond", null],
      [null, "stick",   null],
      [null, "stick",   null]
    ],
    subRecipes: ["stick"]
  },
  {
    id: "wooden_hoe",
    nameEN: "Wooden Hoe",
    nameES: "Azada de Madera",
    sprite: "Wooden_Hoe",
    category: "tools",
    shapeless: false,
    furnace: false,
    grid: [
      ["oak_planks", "oak_planks", null],
      [null,         "stick",      null],
      [null,         "stick",      null]
    ],
    subRecipes: ["oak_planks", "stick"]
  },
  {
    id: "stone_hoe",
    nameEN: "Stone Hoe",
    nameES: "Azada de Piedra",
    sprite: "Stone_Hoe",
    category: "tools",
    shapeless: false,
    furnace: false,
    grid: [
      ["cobblestone", "cobblestone", null],
      [null,          "stick",       null],
      [null,          "stick",       null]
    ],
    subRecipes: ["stick"]
  },
  {
    id: "iron_hoe",
    nameEN: "Iron Hoe",
    nameES: "Azada de Hierro",
    sprite: "Iron_Hoe",
    category: "tools",
    shapeless: false,
    furnace: false,
    grid: [
      ["iron_ingot", "iron_ingot", null],
      [null,         "stick",      null],
      [null,         "stick",      null]
    ],
    subRecipes: ["iron_ingot", "stick"]
  },
  {
    id: "golden_hoe",
    nameEN: "Golden Hoe",
    nameES: "Azada de Oro",
    sprite: "Golden_Hoe",
    category: "tools",
    shapeless: false,
    furnace: false,
    grid: [
      ["gold_ingot", "gold_ingot", null],
      [null,         "stick",      null],
      [null,         "stick",      null]
    ],
    subRecipes: ["gold_ingot", "stick"]
  },
  {
    id: "diamond_hoe",
    nameEN: "Diamond Hoe",
    nameES: "Azada de Diamante",
    sprite: "Diamond_Hoe",
    category: "tools",
    shapeless: false,
    furnace: false,
    grid: [
      ["diamond", "diamond", null],
      [null,      "stick",   null],
      [null,      "stick",   null]
    ],
    subRecipes: ["stick"]
  },
  {
    id: "shears",
    nameEN: "Shears",
    nameES: "Tijeras",
    sprite: "Shears",
    category: "tools",
    shapeless: false,
    furnace: false,
    grid: [
      [null,        "iron_ingot", null],
      ["iron_ingot", null,        null],
      [null,         null,        null]
    ],
    subRecipes: ["iron_ingot"]
  },
  {
    id: "flint_and_steel",
    nameEN: "Flint and Steel",
    nameES: "Eslabón de Pedernal",
    sprite: "Flint_and_Steel",
    category: "tools",
    shapeless: false,
    furnace: false,
    grid: [
      ["iron_ingot", null,   null],
      [null,        "flint", null],
      [null,         null,   null]
    ],
    subRecipes: ["iron_ingot"]
  },
  {
    id: "fishing_rod",
    nameEN: "Fishing Rod",
    nameES: "Caña de Pescar",
    sprite: "Fishing_Rod",
    category: "tools",
    shapeless: false,
    furnace: false,
    grid: [
      [null,   null,   "stick"],
      [null,  "stick", "string"],
      ["stick", null,  "string"]
    ],
    subRecipes: ["stick"]
  },
  {
    id: "compass",
    nameEN: "Compass",
    nameES: "Brújula",
    sprite: "Compass",
    category: "tools",
    shapeless: false,
    furnace: false,
    grid: [
      [null,        "iron_ingot",    null],
      ["iron_ingot", "redstone_dust", "iron_ingot"],
      [null,        "iron_ingot",    null]
    ],
    subRecipes: ["iron_ingot"]
  },
  {
    id: "clock",
    nameEN: "Clock",
    nameES: "Reloj",
    sprite: "Clock",
    category: "tools",
    shapeless: false,
    furnace: false,
    grid: [
      [null,        "gold_ingot",    null],
      ["gold_ingot", "redstone_dust", "gold_ingot"],
      [null,        "gold_ingot",    null]
    ],
    subRecipes: ["gold_ingot"]
  },
  {
    id: "spyglass",
    nameEN: "Spyglass",
    nameES: "Catalejo",
    sprite: "Spyglass",
    category: "tools",
    shapeless: false,
    furnace: false,
    grid: [
      [null, "amethyst_shard", null],
      [null, "copper_ingot",   null],
      [null, "copper_ingot",   null]
    ],
    subRecipes: ["copper_ingot"]
  },

  // ─────────────────── ARMOR ───────────────────
  {
    id: "leather_helmet",
    nameEN: "Leather Helmet",
    nameES: "Casco de Cuero",
    sprite: "Leather_Cap",
    category: "armor",
    shapeless: false,
    furnace: false,
    grid: [
      ["leather", "leather", "leather"],
      ["leather", null,      "leather"],
      [null,      null,      null]
    ],
    subRecipes: []
  },
  {
    id: "leather_chestplate",
    nameEN: "Leather Chestplate",
    nameES: "Peto de Cuero",
    sprite: "Leather_Tunic",
    category: "armor",
    shapeless: false,
    furnace: false,
    grid: [
      ["leather", null,     "leather"],
      ["leather", "leather","leather"],
      ["leather", "leather","leather"]
    ],
    subRecipes: []
  },
  {
    id: "leather_leggings",
    nameEN: "Leather Leggings",
    nameES: "Pantalones de Cuero",
    sprite: "Leather_Pants",
    category: "armor",
    shapeless: false,
    furnace: false,
    grid: [
      ["leather", "leather","leather"],
      ["leather", null,     "leather"],
      ["leather", null,     "leather"]
    ],
    subRecipes: []
  },
  {
    id: "leather_boots",
    nameEN: "Leather Boots",
    nameES: "Botas de Cuero",
    sprite: "Leather_Boots",
    category: "armor",
    shapeless: false,
    furnace: false,
    grid: [
      [null,     null,     null],
      ["leather", null,    "leather"],
      ["leather", null,    "leather"]
    ],
    subRecipes: []
  },
  {
    id: "iron_helmet",
    nameEN: "Iron Helmet",
    nameES: "Casco de Hierro",
    sprite: "Iron_Helmet",
    category: "armor",
    shapeless: false,
    furnace: false,
    grid: [
      ["iron_ingot", "iron_ingot", "iron_ingot"],
      ["iron_ingot", null,         "iron_ingot"],
      [null,         null,         null]
    ],
    subRecipes: ["iron_ingot"]
  },
  {
    id: "iron_chestplate",
    nameEN: "Iron Chestplate",
    nameES: "Peto de Hierro",
    sprite: "Iron_Chestplate",
    category: "armor",
    shapeless: false,
    furnace: false,
    grid: [
      ["iron_ingot", null,         "iron_ingot"],
      ["iron_ingot", "iron_ingot", "iron_ingot"],
      ["iron_ingot", "iron_ingot", "iron_ingot"]
    ],
    subRecipes: ["iron_ingot"]
  },
  {
    id: "iron_leggings",
    nameEN: "Iron Leggings",
    nameES: "Pantalones de Hierro",
    sprite: "Iron_Leggings",
    category: "armor",
    shapeless: false,
    furnace: false,
    grid: [
      ["iron_ingot", "iron_ingot", "iron_ingot"],
      ["iron_ingot", null,         "iron_ingot"],
      ["iron_ingot", null,         "iron_ingot"]
    ],
    subRecipes: ["iron_ingot"]
  },
  {
    id: "iron_boots",
    nameEN: "Iron Boots",
    nameES: "Botas de Hierro",
    sprite: "Iron_Boots",
    category: "armor",
    shapeless: false,
    furnace: false,
    grid: [
      [null,         null,         null],
      ["iron_ingot", null,         "iron_ingot"],
      ["iron_ingot", null,         "iron_ingot"]
    ],
    subRecipes: ["iron_ingot"]
  },
  {
    id: "golden_helmet",
    nameEN: "Golden Helmet",
    nameES: "Casco de Oro",
    sprite: "Golden_Helmet",
    category: "armor",
    shapeless: false,
    furnace: false,
    grid: [
      ["gold_ingot", "gold_ingot", "gold_ingot"],
      ["gold_ingot", null,         "gold_ingot"],
      [null,         null,         null]
    ],
    subRecipes: ["gold_ingot"]
  },
  {
    id: "golden_chestplate",
    nameEN: "Golden Chestplate",
    nameES: "Peto de Oro",
    sprite: "Golden_Chestplate",
    category: "armor",
    shapeless: false,
    furnace: false,
    grid: [
      ["gold_ingot", null,         "gold_ingot"],
      ["gold_ingot", "gold_ingot", "gold_ingot"],
      ["gold_ingot", "gold_ingot", "gold_ingot"]
    ],
    subRecipes: ["gold_ingot"]
  },
  {
    id: "golden_leggings",
    nameEN: "Golden Leggings",
    nameES: "Pantalones de Oro",
    sprite: "Golden_Leggings",
    category: "armor",
    shapeless: false,
    furnace: false,
    grid: [
      ["gold_ingot", "gold_ingot", "gold_ingot"],
      ["gold_ingot", null,         "gold_ingot"],
      ["gold_ingot", null,         "gold_ingot"]
    ],
    subRecipes: ["gold_ingot"]
  },
  {
    id: "golden_boots",
    nameEN: "Golden Boots",
    nameES: "Botas de Oro",
    sprite: "Golden_Boots",
    category: "armor",
    shapeless: false,
    furnace: false,
    grid: [
      [null,         null,         null],
      ["gold_ingot", null,         "gold_ingot"],
      ["gold_ingot", null,         "gold_ingot"]
    ],
    subRecipes: ["gold_ingot"]
  },
  {
    id: "diamond_helmet",
    nameEN: "Diamond Helmet",
    nameES: "Casco de Diamante",
    sprite: "Diamond_Helmet",
    category: "armor",
    shapeless: false,
    furnace: false,
    grid: [
      ["diamond", "diamond", "diamond"],
      ["diamond", null,      "diamond"],
      [null,      null,      null]
    ],
    subRecipes: []
  },
  {
    id: "diamond_chestplate",
    nameEN: "Diamond Chestplate",
    nameES: "Peto de Diamante",
    sprite: "Diamond_Chestplate",
    category: "armor",
    shapeless: false,
    furnace: false,
    grid: [
      ["diamond", null,     "diamond"],
      ["diamond", "diamond","diamond"],
      ["diamond", "diamond","diamond"]
    ],
    subRecipes: []
  },
  {
    id: "diamond_leggings",
    nameEN: "Diamond Leggings",
    nameES: "Pantalones de Diamante",
    sprite: "Diamond_Leggings",
    category: "armor",
    shapeless: false,
    furnace: false,
    grid: [
      ["diamond", "diamond","diamond"],
      ["diamond", null,     "diamond"],
      ["diamond", null,     "diamond"]
    ],
    subRecipes: []
  },
  {
    id: "diamond_boots",
    nameEN: "Diamond Boots",
    nameES: "Botas de Diamante",
    sprite: "Diamond_Boots",
    category: "armor",
    shapeless: false,
    furnace: false,
    grid: [
      [null,     null,     null],
      ["diamond", null,    "diamond"],
      ["diamond", null,    "diamond"]
    ],
    subRecipes: []
  },

  // ─────────────────── BUILDING ───────────────────
  {
    id: "crafting_table",
    nameEN: "Crafting Table",
    nameES: "Mesa de Crafteo",
    sprite: "Crafting_Table",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      ["oak_planks", "oak_planks", null],
      ["oak_planks", "oak_planks", null],
      [null,         null,         null]
    ],
    subRecipes: ["oak_planks"]
  },
  {
    id: "furnace",
    nameEN: "Furnace",
    nameES: "Horno",
    sprite: "Furnace",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      ["cobblestone", "cobblestone", "cobblestone"],
      ["cobblestone", null,          "cobblestone"],
      ["cobblestone", "cobblestone", "cobblestone"]
    ],
    subRecipes: []
  },
  {
    id: "chest",
    nameEN: "Chest",
    nameES: "Cofre",
    sprite: "Chest",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      ["oak_planks", "oak_planks", "oak_planks"],
      ["oak_planks", null,         "oak_planks"],
      ["oak_planks", "oak_planks", "oak_planks"]
    ],
    subRecipes: ["oak_planks"]
  },
  {
    id: "barrel",
    nameEN: "Barrel",
    nameES: "Barril",
    sprite: "Barrel",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      ["oak_planks", "oak_slab",   "oak_planks"],
      ["oak_planks", null,         "oak_planks"],
      ["oak_planks", "oak_slab",   "oak_planks"]
    ],
    subRecipes: ["oak_planks", "oak_slab"]
  },
  {
    id: "bookshelf",
    nameEN: "Bookshelf",
    nameES: "Estantería",
    sprite: "Bookshelf",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      ["oak_planks", "oak_planks", "oak_planks"],
      ["book",       "book",       "book"],
      ["oak_planks", "oak_planks", "oak_planks"]
    ],
    subRecipes: ["book", "oak_planks"]
  },
  {
    id: "ladder",
    nameEN: "Ladder",
    nameES: "Escalera",
    sprite: "Ladder",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      ["stick", null,  "stick"],
      ["stick", "stick","stick"],
      ["stick", null,  "stick"]
    ],
    subRecipes: ["stick"]
  },
  {
    id: "torch",
    nameEN: "Torch",
    nameES: "Antorcha",
    sprite: "Torch",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      [null,  "coal", null],
      [null,  "stick", null],
      [null,  null,    null]
    ],
    subRecipes: ["stick"]
  },
  {
    id: "jack_o_lantern",
    nameEN: "Jack o' Lantern",
    nameES: "Jack o' Lantern",
    sprite: "Jack_o'_Lantern",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      [null,      "carved_pumpkin", null],
      [null,      "torch",          null],
      [null,      null,             null]
    ],
    subRecipes: ["torch"]
  },
  {
    id: "glass_pane",
    nameEN: "Glass Pane",
    nameES: "Panel de Vidrio",
    sprite: "Glass_Pane",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      ["glass", "glass", "glass"],
      ["glass", "glass", "glass"],
      [null,    null,    null]
    ],
    subRecipes: ["glass"]
  },
  {
    id: "iron_bars",
    nameEN: "Iron Bars",
    nameES: "Rejas de Hierro",
    sprite: "Iron_Bars",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      ["iron_ingot", "iron_ingot", "iron_ingot"],
      ["iron_ingot", "iron_ingot", "iron_ingot"],
      [null,         null,         null]
    ],
    subRecipes: ["iron_ingot"]
  },
  {
    id: "iron_door",
    nameEN: "Iron Door",
    nameES: "Puerta de Hierro",
    sprite: "Iron_Door",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      ["iron_ingot", "iron_ingot", null],
      ["iron_ingot", "iron_ingot", null],
      ["iron_ingot", "iron_ingot", null]
    ],
    subRecipes: ["iron_ingot"]
  },
  {
    id: "oak_door",
    nameEN: "Oak Door",
    nameES: "Puerta de Roble",
    sprite: "Oak_Door",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      ["oak_planks", "oak_planks", null],
      ["oak_planks", "oak_planks", null],
      ["oak_planks", "oak_planks", null]
    ],
    subRecipes: ["oak_planks"]
  },
  {
    id: "oak_trapdoor",
    nameEN: "Oak Trapdoor",
    nameES: "Trampilla de Roble",
    sprite: "Oak_Trapdoor",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      ["oak_planks", "oak_planks", "oak_planks"],
      ["oak_planks", "oak_planks", "oak_planks"],
      [null,         null,         null]
    ],
    subRecipes: ["oak_planks"]
  },
  {
    id: "oak_fence",
    nameEN: "Oak Fence",
    nameES: "Valla de Roble",
    sprite: "Oak_Fence",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      ["oak_planks", "stick",      "oak_planks"],
      ["oak_planks", "stick",      "oak_planks"],
      [null,         null,         null]
    ],
    subRecipes: ["oak_planks", "stick"]
  },
  {
    id: "oak_fence_gate",
    nameEN: "Oak Fence Gate",
    nameES: "Puerta de Valla de Roble",
    sprite: "Oak_Fence_Gate",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      ["stick",      "oak_planks", "stick"],
      ["stick",      "oak_planks", "stick"],
      [null,         null,         null]
    ],
    subRecipes: ["oak_planks", "stick"]
  },
  {
    id: "oak_stairs",
    nameEN: "Oak Stairs",
    nameES: "Escaleras de Roble",
    sprite: "Oak_Stairs",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      ["oak_planks", null,         null],
      ["oak_planks", "oak_planks", null],
      ["oak_planks", "oak_planks", "oak_planks"]
    ],
    subRecipes: ["oak_planks"]
  },
  {
    id: "oak_slab",
    nameEN: "Oak Slab",
    nameES: "Losa de Roble",
    sprite: "Oak_Slab",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      [null,         null,         null],
      [null,         null,         null],
      ["oak_planks", "oak_planks", "oak_planks"]
    ],
    subRecipes: ["oak_planks"]
  },
  {
    id: "stone_bricks",
    nameEN: "Stone Bricks",
    nameES: "Ladrillos de Piedra",
    sprite: "Stone_Bricks",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      ["stone", "stone", null],
      ["stone", "stone", null],
      [null,    null,    null]
    ],
    subRecipes: ["smooth_stone"]
  },
  {
    id: "chiseled_stone_bricks",
    nameEN: "Chiseled Stone Bricks",
    nameES: "Ladrillos de Piedra Cincelados",
    sprite: "Chiseled_Stone_Bricks",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      [null,             "stone_brick_slab", null],
      [null,             "stone_brick_slab", null],
      [null,             null,               null]
    ],
    subRecipes: ["stone_bricks"]
  },
  {
    id: "stone_brick_stairs",
    nameEN: "Stone Brick Stairs",
    nameES: "Escaleras de Ladrillos de Piedra",
    sprite: "Stone_Brick_Stairs",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      ["stone_bricks", null,          null],
      ["stone_bricks", "stone_bricks", null],
      ["stone_bricks", "stone_bricks", "stone_bricks"]
    ],
    subRecipes: ["stone_bricks"]
  },
  {
    id: "brick_slab",
    nameEN: "Brick Slab",
    nameES: "Losa de Ladrillo",
    sprite: "Brick_Slab",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      [null,    null,    null],
      [null,    null,    null],
      ["bricks","bricks","bricks"]
    ],
    subRecipes: ["bricks"]
  },
  {
    id: "brick_stairs",
    nameEN: "Brick Stairs",
    nameES: "Escaleras de Ladrillo",
    sprite: "Brick_Stairs",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      ["bricks", null,    null],
      ["bricks", "bricks", null],
      ["bricks", "bricks", "bricks"]
    ],
    subRecipes: ["bricks"]
  },
  {
    id: "sandstone",
    nameEN: "Sandstone",
    nameES: "Arenisca",
    sprite: "Sandstone",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      ["sand", "sand", null],
      ["sand", "sand", null],
      [null,   null,   null]
    ],
    subRecipes: []
  },
  {
    id: "cut_sandstone",
    nameEN: "Cut Sandstone",
    nameES: "Arenisca Cortada",
    sprite: "Cut_Sandstone",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      ["sandstone", "sandstone", null],
      ["sandstone", "sandstone", null],
      [null,        null,        null]
    ],
    subRecipes: ["sandstone"]
  },
  {
    id: "oak_planks",
    nameEN: "Oak Planks",
    nameES: "Tablones de Roble",
    sprite: "Oak_Planks",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      [null,      null,      null],
      [null,      "oak_log", null],
      [null,      null,      null]
    ],
    subRecipes: []
  },
  {
    id: "stick",
    nameEN: "Stick",
    nameES: "Palo",
    sprite: "Stick",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      [null,         null,         null],
      [null,         "oak_planks",  null],
      [null,         "oak_planks",  null]
    ],
    subRecipes: ["oak_planks"]
  },
  {
    id: "bowl",
    nameEN: "Bowl",
    nameES: "Cuenco",
    sprite: "Bowl",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      [null,         null,         null],
      ["oak_planks", null,         "oak_planks"],
      [null,         "oak_planks", null]
    ],
    subRecipes: ["oak_planks"]
  },
  {
    id: "painting",
    nameEN: "Painting",
    nameES: "Pintura",
    sprite: "Painting",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      ["stick", "stick", "stick"],
      ["stick", "wool",  "stick"],
      ["stick", "stick", "stick"]
    ],
    subRecipes: ["stick"]
  },
  {
    id: "item_frame",
    nameEN: "Item Frame",
    nameES: "Marco de Objeto",
    sprite: "Item_Frame",
    category: "building",
    shapeless: false,
    furnace: false,
    grid: [
      ["stick", "stick",  "stick"],
      ["stick", "leather","stick"],
      ["stick", "stick",  "stick"]
    ],
    subRecipes: ["stick"]
  },

  // ─────────────────── FOOD ───────────────────
  {
    id: "bread",
    nameEN: "Bread",
    nameES: "Pan",
    sprite: "Bread",
    category: "food",
    shapeless: false,
    furnace: false,
    grid: [
      [null,  null,  null],
      [null,  null,  null],
      ["wheat","wheat","wheat"]
    ],
    subRecipes: []
  },
  {
    id: "cake",
    nameEN: "Cake",
    nameES: "Pastel",
    sprite: "Cake",
    category: "food",
    shapeless: false,
    furnace: false,
    grid: [
      ["milk_bucket", "milk_bucket", "milk_bucket"],
      ["sugar",       "egg",         "sugar"],
      ["wheat",       "wheat",       "wheat"]
    ],
    subRecipes: []
  },
  {
    id: "cookie",
    nameEN: "Cookie",
    nameES: "Galleta",
    sprite: "Cookie",
    category: "food",
    shapeless: false,
    furnace: false,
    grid: [
      [null,   null,     null],
      ["wheat","cocoa_beans","wheat"],
      [null,   null,     null]
    ],
    subRecipes: []
  },
  {
    id: "pumpkin_pie",
    nameEN: "Pumpkin Pie",
    nameES: "Tarta de Calabaza",
    sprite: "Pumpkin_Pie",
    category: "food",
    shapeless: false,
    furnace: false,
    grid: [
      [null,     null,  null],
      ["pumpkin","sugar","egg"],
      [null,     null,  null]
    ],
    subRecipes: []
  },
  {
    id: "golden_apple",
    nameEN: "Golden Apple",
    nameES: "Manzana Dorada",
    sprite: "Golden_Apple",
    category: "food",
    shapeless: false,
    furnace: false,
    grid: [
      ["gold_ingot", "gold_ingot", "gold_ingot"],
      ["gold_ingot", "apple",      "gold_ingot"],
      ["gold_ingot", "gold_ingot", "gold_ingot"]
    ],
    subRecipes: ["gold_ingot"]
  },
  {
    id: "golden_carrot",
    nameEN: "Golden Carrot",
    nameES: "Zanahoria Dorada",
    sprite: "Golden_Carrot",
    category: "food",
    shapeless: false,
    furnace: false,
    grid: [
      ["gold_nugget","gold_nugget","gold_nugget"],
      ["gold_nugget","carrot",     "gold_nugget"],
      ["gold_nugget","gold_nugget","gold_nugget"]
    ],
    subRecipes: []
  },
  {
    id: "mushroom_stew",
    nameEN: "Mushroom Stew",
    nameES: "Guiso de Setas",
    sprite: "Mushroom_Stew",
    category: "food",
    shapeless: true,
    furnace: false,
    grid: [
      ["red_mushroom",   null,  null],
      ["brown_mushroom", null,  null],
      ["bowl",           null,  null]
    ],
    subRecipes: ["bowl"]
  },
  {
    id: "rabbit_stew",
    nameEN: "Rabbit Stew",
    nameES: "Guiso de Conejo",
    sprite: "Rabbit_Stew",
    category: "food",
    shapeless: false,
    furnace: false,
    grid: [
      [null,           "cooked_rabbit", null],
      ["carrot",       "baked_potato",  "brown_mushroom"],
      [null,           "bowl",          null]
    ],
    subRecipes: ["bowl"]
  },
  {
    id: "beetroot_soup",
    nameEN: "Beetroot Soup",
    nameES: "Sopa de Remolacha",
    sprite: "Beetroot_Soup",
    category: "food",
    shapeless: false,
    furnace: false,
    grid: [
      ["beetroot","beetroot","beetroot"],
      ["beetroot","beetroot","beetroot"],
      [null,      "bowl",    null]
    ],
    subRecipes: ["bowl"]
  },

  // ─────────────────── REDSTONE ───────────────────
  {
    id: "piston",
    nameEN: "Piston",
    nameES: "Pistón",
    sprite: "Piston",
    category: "redstone",
    shapeless: false,
    furnace: false,
    grid: [
      ["oak_planks",  "oak_planks",   "oak_planks"],
      ["cobblestone", "iron_ingot",   "cobblestone"],
      ["cobblestone", "redstone_dust","cobblestone"]
    ],
    subRecipes: ["oak_planks", "iron_ingot"]
  },
  {
    id: "sticky_piston",
    nameEN: "Sticky Piston",
    nameES: "Pistón Pegajoso",
    sprite: "Sticky_Piston",
    category: "redstone",
    shapeless: false,
    furnace: false,
    grid: [
      [null,    "slimeball", null],
      [null,    "piston",    null],
      [null,    null,        null]
    ],
    subRecipes: ["piston"]
  },
  {
    id: "repeater",
    nameEN: "Repeater",
    nameES: "Repetidor",
    sprite: "Redstone_Repeater",
    category: "redstone",
    shapeless: false,
    furnace: false,
    grid: [
      [null,           null,          null],
      ["redstone_torch","redstone_dust","redstone_torch"],
      ["stone",        "stone",       "stone"]
    ],
    subRecipes: ["redstone_torch"]
  },
  {
    id: "comparator",
    nameEN: "Comparator",
    nameES: "Comparador",
    sprite: "Redstone_Comparator",
    category: "redstone",
    shapeless: false,
    furnace: false,
    grid: [
      [null,           "redstone_torch", null],
      ["redstone_torch","quartz",        "redstone_torch"],
      ["stone",        "stone",          "stone"]
    ],
    subRecipes: ["redstone_torch"]
  },
  {
    id: "lever",
    nameEN: "Lever",
    nameES: "Palanca",
    sprite: "Lever",
    category: "redstone",
    shapeless: false,
    furnace: false,
    grid: [
      [null,  "stick",       null],
      [null,  "cobblestone", null],
      [null,  null,          null]
    ],
    subRecipes: ["stick"]
  },
  {
    id: "oak_button",
    nameEN: "Oak Button",
    nameES: "Botón de Roble",
    sprite: "Oak_Button",
    category: "redstone",
    shapeless: false,
    furnace: false,
    grid: [
      [null,         null,         null],
      [null,         "oak_planks", null],
      [null,         null,         null]
    ],
    subRecipes: ["oak_planks"]
  },
  {
    id: "stone_button",
    nameEN: "Stone Button",
    nameES: "Botón de Piedra",
    sprite: "Stone_Button",
    category: "redstone",
    shapeless: false,
    furnace: false,
    grid: [
      [null,    null,    null],
      [null,    "stone", null],
      [null,    null,    null]
    ],
    subRecipes: []
  },
  {
    id: "oak_pressure_plate",
    nameEN: "Oak Pressure Plate",
    nameES: "Placa de Presión de Roble",
    sprite: "Oak_Pressure_Plate",
    category: "redstone",
    shapeless: false,
    furnace: false,
    grid: [
      [null,         null,         null],
      [null,         null,         null],
      ["oak_planks", "oak_planks", null]
    ],
    subRecipes: ["oak_planks"]
  },
  {
    id: "stone_pressure_plate",
    nameEN: "Stone Pressure Plate",
    nameES: "Placa de Presión de Piedra",
    sprite: "Stone_Pressure_Plate",
    category: "redstone",
    shapeless: false,
    furnace: false,
    grid: [
      [null,    null,    null],
      [null,    null,    null],
      ["stone", "stone", null]
    ],
    subRecipes: []
  },
  {
    id: "dispenser",
    nameEN: "Dispenser",
    nameES: "Dispensador",
    sprite: "Dispenser",
    category: "redstone",
    shapeless: false,
    furnace: false,
    grid: [
      ["cobblestone", "cobblestone", "cobblestone"],
      ["cobblestone", "bow",         "cobblestone"],
      ["cobblestone", "redstone_dust","cobblestone"]
    ],
    subRecipes: ["bow"]
  },
  {
    id: "dropper",
    nameEN: "Dropper",
    nameES: "Soltador",
    sprite: "Dropper",
    category: "redstone",
    shapeless: false,
    furnace: false,
    grid: [
      ["cobblestone", "cobblestone", "cobblestone"],
      ["cobblestone", null,          "cobblestone"],
      ["cobblestone", "redstone_dust","cobblestone"]
    ],
    subRecipes: []
  },
  {
    id: "hopper",
    nameEN: "Hopper",
    nameES: "Tolva",
    sprite: "Hopper",
    category: "redstone",
    shapeless: false,
    furnace: false,
    grid: [
      ["iron_ingot", null,        "iron_ingot"],
      ["iron_ingot", "chest",     "iron_ingot"],
      [null,         "iron_ingot", null]
    ],
    subRecipes: ["iron_ingot", "chest"]
  },
  {
    id: "observer",
    nameEN: "Observer",
    nameES: "Observador",
    sprite: "Observer",
    category: "redstone",
    shapeless: false,
    furnace: false,
    grid: [
      ["cobblestone",  "cobblestone",  "cobblestone"],
      ["redstone_dust","redstone_dust","quartz"],
      ["cobblestone",  "cobblestone",  "cobblestone"]
    ],
    subRecipes: []
  },
  {
    id: "tripwire_hook",
    nameEN: "Tripwire Hook",
    nameES: "Gancho de Trampa",
    sprite: "Tripwire_Hook",
    category: "redstone",
    shapeless: false,
    furnace: false,
    grid: [
      [null,         "iron_ingot",  null],
      [null,         "stick",       null],
      [null,         "oak_planks",  null]
    ],
    subRecipes: ["iron_ingot", "stick", "oak_planks"]
  },
  {
    id: "daylight_detector",
    nameEN: "Daylight Detector",
    nameES: "Detector de Luz Solar",
    sprite: "Daylight_Detector",
    category: "redstone",
    shapeless: false,
    furnace: false,
    grid: [
      ["glass",        "glass",        "glass"],
      ["quartz",       "quartz",       "quartz"],
      ["oak_slab",     "oak_slab",     "oak_slab"]
    ],
    subRecipes: ["glass", "oak_slab"]
  },
  {
    id: "redstone_lamp",
    nameEN: "Redstone Lamp",
    nameES: "Lámpara de Redstone",
    sprite: "Redstone_Lamp",
    category: "redstone",
    shapeless: false,
    furnace: false,
    grid: [
      [null,           "redstone_dust", null],
      ["redstone_dust","glowstone",     "redstone_dust"],
      [null,           "redstone_dust", null]
    ],
    subRecipes: []
  },
  {
    id: "redstone_torch",
    nameEN: "Redstone Torch",
    nameES: "Antorcha de Redstone",
    sprite: "Redstone_Torch",
    category: "redstone",
    shapeless: false,
    furnace: false,
    grid: [
      [null,           "redstone_dust", null],
      [null,           "stick",         null],
      [null,           null,            null]
    ],
    subRecipes: ["stick"]
  },
  {
    id: "target_block",
    nameEN: "Target Block",
    nameES: "Bloque Objetivo",
    sprite: "Target",
    category: "redstone",
    shapeless: false,
    furnace: false,
    grid: [
      [null,           "redstone_dust",  null],
      ["redstone_dust","hay_bale",       "redstone_dust"],
      [null,           "redstone_dust",  null]
    ],
    subRecipes: []
  },

  // ─────────────────── MISC ───────────────────
  {
    id: "book",
    nameEN: "Book",
    nameES: "Libro",
    sprite: "Book",
    category: "misc",
    shapeless: true,
    furnace: false,
    grid: [
      ["paper",   null, null],
      ["paper",   null, null],
      ["leather", null, null]
    ],
    subRecipes: ["paper"]
  },
  {
    id: "paper",
    nameEN: "Paper",
    nameES: "Papel",
    sprite: "Paper",
    category: "misc",
    shapeless: false,
    furnace: false,
    grid: [
      [null,           null,           null],
      ["sugar_cane",   "sugar_cane",   "sugar_cane"],
      [null,           null,           null]
    ],
    subRecipes: []
  },
  {
    id: "map",
    nameEN: "Map",
    nameES: "Mapa",
    sprite: "Map",
    category: "misc",
    shapeless: false,
    furnace: false,
    grid: [
      ["paper", "paper", "paper"],
      ["paper", "compass","paper"],
      ["paper", "paper", "paper"]
    ],
    subRecipes: ["paper", "compass"]
  },
  {
    id: "minecart",
    nameEN: "Minecart",
    nameES: "Vagoneta",
    sprite: "Minecart",
    category: "misc",
    shapeless: false,
    furnace: false,
    grid: [
      [null,         null,         null],
      ["iron_ingot", null,         "iron_ingot"],
      ["iron_ingot", "iron_ingot", "iron_ingot"]
    ],
    subRecipes: ["iron_ingot"]
  },
  {
    id: "oak_boat",
    nameEN: "Oak Boat",
    nameES: "Bote de Roble",
    sprite: "Oak_Boat",
    category: "misc",
    shapeless: false,
    furnace: false,
    grid: [
      [null,         null,         null],
      ["oak_planks", null,         "oak_planks"],
      ["oak_planks", "oak_planks", "oak_planks"]
    ],
    subRecipes: ["oak_planks"]
  },
  {
    id: "ender_chest",
    nameEN: "Ender Chest",
    nameES: "Cofre del Fin",
    sprite: "Ender_Chest",
    category: "misc",
    shapeless: false,
    furnace: false,
    grid: [
      ["obsidian",     "obsidian",    "obsidian"],
      ["obsidian",     "ender_eye",   "obsidian"],
      ["obsidian",     "obsidian",    "obsidian"]
    ],
    subRecipes: []
  },
  {
    id: "beacon",
    nameEN: "Beacon",
    nameES: "Baliza",
    sprite: "Beacon",
    category: "misc",
    shapeless: false,
    furnace: false,
    grid: [
      ["glass",        "glass",       "glass"],
      ["glass",        "nether_star", "glass"],
      ["obsidian",     "obsidian",    "obsidian"]
    ],
    subRecipes: ["glass"]
  },
  {
    id: "anvil",
    nameEN: "Anvil",
    nameES: "Yunque",
    sprite: "Anvil",
    category: "misc",
    shapeless: false,
    furnace: false,
    grid: [
      ["iron_block",  "iron_block",  "iron_block"],
      [null,          "iron_ingot",  null],
      ["iron_block",  "iron_block",  "iron_block"]
    ],
    subRecipes: ["iron_ingot"]
  },
  {
    id: "grindstone",
    nameEN: "Grindstone",
    nameES: "Piedra de Afilar",
    sprite: "Grindstone",
    category: "misc",
    shapeless: false,
    furnace: false,
    grid: [
      ["stick",      "stone_slab",  "stick"],
      ["oak_planks", null,          "oak_planks"],
      [null,         null,          null]
    ],
    subRecipes: ["stick", "oak_planks"]
  },
  {
    id: "smithing_table",
    nameEN: "Smithing Table",
    nameES: "Mesa de Herrería",
    sprite: "Smithing_Table",
    category: "misc",
    shapeless: false,
    furnace: false,
    grid: [
      ["iron_ingot", "iron_ingot", null],
      ["oak_planks", "oak_planks", null],
      ["oak_planks", "oak_planks", null]
    ],
    subRecipes: ["iron_ingot", "oak_planks"]
  },
  {
    id: "stonecutter",
    nameEN: "Stonecutter",
    nameES: "Cortapiedras",
    sprite: "Stonecutter",
    category: "misc",
    shapeless: false,
    furnace: false,
    grid: [
      [null,   null,   null],
      [null,   "iron_ingot", null],
      ["stone","stone","stone"]
    ],
    subRecipes: ["iron_ingot"]
  },
  {
    id: "loom",
    nameEN: "Loom",
    nameES: "Telar",
    sprite: "Loom",
    category: "misc",
    shapeless: false,
    furnace: false,
    grid: [
      ["string",     "string",     null],
      ["oak_planks", "oak_planks", null],
      [null,         null,         null]
    ],
    subRecipes: ["oak_planks"]
  },
  {
    id: "cartography_table",
    nameEN: "Cartography Table",
    nameES: "Mesa de Cartografía",
    sprite: "Cartography_Table",
    category: "misc",
    shapeless: false,
    furnace: false,
    grid: [
      ["paper",      "paper",      null],
      ["oak_planks", "oak_planks", null],
      ["oak_planks", "oak_planks", null]
    ],
    subRecipes: ["paper", "oak_planks"]
  },
  {
    id: "fletching_table",
    nameEN: "Fletching Table",
    nameES: "Mesa de Flechero",
    sprite: "Fletching_Table",
    category: "misc",
    shapeless: false,
    furnace: false,
    grid: [
      ["flint",      "flint",      null],
      ["oak_planks", "oak_planks", null],
      ["oak_planks", "oak_planks", null]
    ],
    subRecipes: ["oak_planks"]
  },
  {
    id: "blast_furnace",
    nameEN: "Blast Furnace",
    nameES: "Alto Horno",
    sprite: "Blast_Furnace",
    category: "misc",
    shapeless: false,
    furnace: false,
    grid: [
      ["iron_ingot", "iron_ingot", "iron_ingot"],
      ["iron_ingot", "furnace",    "iron_ingot"],
      ["smooth_stone","smooth_stone","smooth_stone"]
    ],
    subRecipes: ["iron_ingot", "furnace", "smooth_stone"]
  },
  {
    id: "smoker",
    nameEN: "Smoker",
    nameES: "Ahumador",
    sprite: "Smoker",
    category: "misc",
    shapeless: false,
    furnace: false,
    grid: [
      [null,      "oak_log",  null],
      ["oak_log", "furnace",  "oak_log"],
      [null,      "oak_log",  null]
    ],
    subRecipes: ["furnace"]
  },
  {
    id: "campfire",
    nameEN: "Campfire",
    nameES: "Fogata",
    sprite: "Campfire",
    category: "misc",
    shapeless: false,
    furnace: false,
    grid: [
      [null,   "stick",  null],
      ["stick","coal",   "stick"],
      ["oak_log","oak_log","oak_log"]
    ],
    subRecipes: ["stick"]
  },
  {
    id: "lantern",
    nameEN: "Lantern",
    nameES: "Linterna",
    sprite: "Lantern",
    category: "misc",
    shapeless: false,
    furnace: false,
    grid: [
      [null,         "iron_nugget", null],
      ["iron_nugget","torch",       "iron_nugget"],
      [null,         "iron_nugget", null]
    ],
    subRecipes: ["torch"]
  },
  {
    id: "soul_lantern",
    nameEN: "Soul Lantern",
    nameES: "Linterna de Alma",
    sprite: "Soul_Lantern",
    category: "misc",
    shapeless: false,
    furnace: false,
    grid: [
      [null,         "iron_nugget",  null],
      ["iron_nugget","soul_torch",   "iron_nugget"],
      [null,         "iron_nugget",  null]
    ],
    subRecipes: ["soul_torch"]
  },
  {
    id: "bell",
    nameEN: "Bell",
    nameES: "Campana",
    sprite: "Bell",
    category: "misc",
    shapeless: false,
    furnace: false,
    grid: [
      [null,         "stick",       null],
      ["oak_planks", "gold_ingot",  "oak_planks"],
      [null,         "stick",       null]
    ],
    subRecipes: ["stick", "gold_ingot", "oak_planks"]
  },
  {
    id: "shield",
    nameEN: "Shield",
    nameES: "Escudo",
    sprite: "Shield",
    category: "misc",
    shapeless: false,
    furnace: false,
    grid: [
      ["oak_planks", "iron_ingot", "oak_planks"],
      ["oak_planks", "oak_planks", "oak_planks"],
      [null,         "oak_planks", null]
    ],
    subRecipes: ["oak_planks", "iron_ingot"]
  },
  {
    id: "bundle",
    nameEN: "Bundle",
    nameES: "Paquete",
    sprite: "Bundle",
    category: "misc",
    shapeless: false,
    furnace: false,
    grid: [
      ["string",  "string",  null],
      ["leather", null,      "leather"],
      ["leather", "leather", "leather"]
    ],
    subRecipes: []
  },
  {
    id: "lead",
    nameEN: "Lead",
    nameES: "Correa",
    sprite: "Lead",
    category: "misc",
    shapeless: false,
    furnace: false,
    grid: [
      ["string",    "string",    null],
      ["string",    "slimeball", null],
      [null,        null,        "string"]
    ],
    subRecipes: []
  },

  // ─────────────────── SMELTING ───────────────────
  {
    id: "iron_ingot",
    nameEN: "Iron Ingot (Smelted)",
    nameES: "Lingote de Hierro (Fundido)",
    sprite: "Iron_Ingot",
    category: "smelting",
    shapeless: false,
    furnace: true,
    grid: [
      ["raw_iron", null, null],
      ["coal",     null, null],
      [null,       null, null]
    ],
    subRecipes: []
  },
  {
    id: "gold_ingot",
    nameEN: "Gold Ingot (Smelted)",
    nameES: "Lingote de Oro (Fundido)",
    sprite: "Gold_Ingot",
    category: "smelting",
    shapeless: false,
    furnace: true,
    grid: [
      ["raw_gold", null, null],
      ["coal",     null, null],
      [null,       null, null]
    ],
    subRecipes: []
  },
  {
    id: "glass",
    nameEN: "Glass",
    nameES: "Vidrio",
    sprite: "Glass",
    category: "smelting",
    shapeless: false,
    furnace: true,
    grid: [
      ["sand", null, null],
      ["coal", null, null],
      [null,   null, null]
    ],
    subRecipes: []
  },
  {
    id: "bricks",
    nameEN: "Bricks",
    nameES: "Ladrillos",
    sprite: "Bricks",
    category: "smelting",
    shapeless: false,
    furnace: true,
    grid: [
      ["clay_ball", null, null],
      ["coal",      null, null],
      [null,        null, null]
    ],
    subRecipes: []
  },
  {
    id: "charcoal",
    nameEN: "Charcoal",
    nameES: "Carbón Vegetal",
    sprite: "Charcoal",
    category: "smelting",
    shapeless: false,
    furnace: true,
    grid: [
      ["oak_log", null, null],
      ["coal",    null, null],
      [null,      null, null]
    ],
    subRecipes: []
  },
  {
    id: "smooth_stone",
    nameEN: "Smooth Stone",
    nameES: "Piedra Lisa",
    sprite: "Smooth_Stone",
    category: "smelting",
    shapeless: false,
    furnace: true,
    grid: [
      ["stone", null, null],
      ["coal",  null, null],
      [null,    null, null]
    ],
    subRecipes: []
  },
  {
    id: "terracotta",
    nameEN: "Terracotta",
    nameES: "Terracota",
    sprite: "Terracotta",
    category: "smelting",
    shapeless: false,
    furnace: true,
    grid: [
      ["clay",  null, null],
      ["coal",  null, null],
      [null,    null, null]
    ],
    subRecipes: []
  },
  {
    id: "cooked_beef",
    nameEN: "Cooked Beef",
    nameES: "Carne Asada",
    sprite: "Cooked_Beef",
    category: "smelting",
    shapeless: false,
    furnace: true,
    grid: [
      ["beef", null, null],
      ["coal", null, null],
      [null,   null, null]
    ],
    subRecipes: []
  },
  {
    id: "cooked_chicken",
    nameEN: "Cooked Chicken",
    nameES: "Pollo Asado",
    sprite: "Cooked_Chicken",
    category: "smelting",
    shapeless: false,
    furnace: true,
    grid: [
      ["chicken", null, null],
      ["coal",    null, null],
      [null,      null, null]
    ],
    subRecipes: []
  },
  {
    id: "cooked_porkchop",
    nameEN: "Cooked Porkchop",
    nameES: "Chuleta Asada",
    sprite: "Cooked_Porkchop",
    category: "smelting",
    shapeless: false,
    furnace: true,
    grid: [
      ["porkchop", null, null],
      ["coal",     null, null],
      [null,       null, null]
    ],
    subRecipes: []
  },
  {
    id: "dried_kelp",
    nameEN: "Dried Kelp",
    nameES: "Alga Seca",
    sprite: "Dried_Kelp",
    category: "smelting",
    shapeless: false,
    furnace: true,
    grid: [
      ["kelp", null, null],
      ["coal", null, null],
      [null,   null, null]
    ],
    subRecipes: []
  },
  {
    id: "cooked_salmon",
    nameEN: "Cooked Salmon",
    nameES: "Salmón Asado",
    sprite: "Cooked_Salmon",
    category: "smelting",
    shapeless: false,
    furnace: true,
    grid: [
      ["salmon", null, null],
      ["coal",   null, null],
      [null,     null, null]
    ],
    subRecipes: []
  },
  {
    id: "cooked_cod",
    nameEN: "Cooked Cod",
    nameES: "Bacalao Asado",
    sprite: "Cooked_Cod",
    category: "smelting",
    shapeless: false,
    furnace: true,
    grid: [
      ["cod",  null, null],
      ["coal", null, null],
      [null,   null, null]
    ],
    subRecipes: []
  },
  {
    id: "copper_ingot",
    nameEN: "Copper Ingot (Smelted)",
    nameES: "Lingote de Cobre (Fundido)",
    sprite: "Copper_Ingot",
    category: "smelting",
    shapeless: false,
    furnace: true,
    grid: [
      ["raw_copper", null, null],
      ["coal",       null, null],
      [null,         null, null]
    ],
    subRecipes: []
  }
];

// ── Category index ──────────────────────────────────────
const CATEGORIES = {
  weapons:  RECIPES.filter(r => r.category === "weapons").map(r => r.id),
  tools:    RECIPES.filter(r => r.category === "tools").map(r => r.id),
  armor:    RECIPES.filter(r => r.category === "armor").map(r => r.id),
  building: RECIPES.filter(r => r.category === "building").map(r => r.id),
  food:     RECIPES.filter(r => r.category === "food").map(r => r.id),
  redstone: RECIPES.filter(r => r.category === "redstone").map(r => r.id),
  misc:     RECIPES.filter(r => r.category === "misc").map(r => r.id),
  smelting: RECIPES.filter(r => r.category === "smelting").map(r => r.id)
};

// ── Valid furnace fuels ──────────────────────────────────
const FUELS = [
  "coal", "charcoal", "oak_planks", "spruce_planks",
  "birch_planks", "jungle_planks", "acacia_planks", "dark_oak_planks",
  "stick", "oak_log", "spruce_log", "wooden_sword",
  "wooden_pickaxe", "wooden_axe", "wooden_shovel", "wooden_hoe"
];

// ── Shapeless recipe IDs ─────────────────────────────────
const SHAPELESS_RECIPES = RECIPES.filter(r => r.shapeless).map(r => r.id);

// ── Item display names lookup (flat id → {en, es}) ──────
const ITEM_NAMES = {};
RECIPES.forEach(r => {
  ITEM_NAMES[r.id] = { en: r.nameEN, es: r.nameES };
});

// ── Extra ingredient names not in RECIPES (raw materials) ─
const INGREDIENT_NAMES = {
  oak_log:        { en: "Oak Log",          es: "Tronco de Roble" },
  oak_planks:     { en: "Oak Planks",       es: "Tablones de Roble" },
  cobblestone:    { en: "Cobblestone",      es: "Piedra" },
  iron_ingot:     { en: "Iron Ingot",       es: "Lingote de Hierro" },
  gold_ingot:     { en: "Gold Ingot",       es: "Lingote de Oro" },
  diamond:        { en: "Diamond",          es: "Diamante" },
  stick:          { en: "Stick",            es: "Palo" },
  string:         { en: "String",           es: "Cuerda" },
  feather:        { en: "Feather",          es: "Pluma" },
  flint:          { en: "Flint",            es: "Pedernal" },
  leather:        { en: "Leather",          es: "Cuero" },
  wool:           { en: "Wool",             es: "Lana" },
  wheat:          { en: "Wheat",            es: "Trigo" },
  sugar:          { en: "Sugar",            es: "Azúcar" },
  egg:            { en: "Egg",              es: "Huevo" },
  milk_bucket:    { en: "Milk Bucket",      es: "Cubo de Leche" },
  cocoa_beans:    { en: "Cocoa Beans",      es: "Granos de Cacao" },
  pumpkin:        { en: "Pumpkin",          es: "Calabaza" },
  apple:          { en: "Apple",            es: "Manzana" },
  carrot:         { en: "Carrot",           es: "Zanahoria" },
  gold_nugget:    { en: "Gold Nugget",      es: "Pepita de Oro" },
  iron_nugget:    { en: "Iron Nugget",      es: "Pepita de Hierro" },
  red_mushroom:   { en: "Red Mushroom",     es: "Seta Roja" },
  brown_mushroom: { en: "Brown Mushroom",   es: "Seta Café" },
  baked_potato:   { en: "Baked Potato",     es: "Patata Asada" },
  cooked_rabbit:  { en: "Cooked Rabbit",    es: "Conejo Asado" },
  beetroot:       { en: "Beetroot",         es: "Remolacha" },
  redstone_dust:  { en: "Redstone Dust",    es: "Polvo de Redstone" },
  slimeball:      { en: "Slimeball",        es: "Bola de Slime" },
  redstone_torch: { en: "Redstone Torch",   es: "Antorcha de Redstone" },
  stone:          { en: "Stone",            es: "Piedra Lisa" },
  quartz:         { en: "Nether Quartz",    es: "Cuarzo del Nether" },
  glowstone:      { en: "Glowstone",        es: "Glowstone" },
  hay_bale:       { en: "Hay Bale",         es: "Bala de Heno" },
  paper:          { en: "Paper",            es: "Papel" },
  compass:        { en: "Compass",          es: "Brújula" },
  obsidian:       { en: "Obsidian",         es: "Obsidiana" },
  ender_eye:      { en: "Eye of Ender",     es: "Ojo del Fin" },
  nether_star:    { en: "Nether Star",      es: "Estrella del Nether" },
  glass:          { en: "Glass",            es: "Vidrio" },
  iron_block:     { en: "Iron Block",       es: "Bloque de Hierro" },
  stone_slab:     { en: "Stone Slab",       es: "Losa de Piedra" },
  smooth_stone:   { en: "Smooth Stone",     es: "Piedra Lisa" },
  furnace:        { en: "Furnace",          es: "Horno" },
  coal:           { en: "Coal",             es: "Carbón" },
  sand:           { en: "Sand",             es: "Arena" },
  clay_ball:      { en: "Clay Ball",        es: "Bola de Arcilla" },
  clay:           { en: "Clay",             es: "Arcilla" },
  raw_iron:       { en: "Raw Iron",         es: "Hierro Crudo" },
  raw_gold:       { en: "Raw Gold",         es: "Oro Crudo" },
  raw_copper:     { en: "Raw Copper",       es: "Cobre Crudo" },
  beef:           { en: "Raw Beef",         es: "Carne de Res Cruda" },
  chicken:        { en: "Raw Chicken",      es: "Pollo Crudo" },
  porkchop:       { en: "Raw Porkchop",     es: "Chuleta Cruda" },
  kelp:           { en: "Kelp",             es: "Alga" },
  salmon:         { en: "Raw Salmon",       es: "Salmón Crudo" },
  cod:            { en: "Raw Cod",          es: "Bacalao Crudo" },
  soul_torch:     { en: "Soul Torch",       es: "Antorcha de Alma" },
  carved_pumpkin: { en: "Carved Pumpkin",   es: "Calabaza Tallada" },
  torch:          { en: "Torch",            es: "Antorcha" },
  piston:         { en: "Piston",           es: "Pistón" },
  bow:            { en: "Bow",              es: "Arco" },
  chest:          { en: "Chest",            es: "Cofre" },
  amethyst_shard: { en: "Amethyst Shard",   es: "Fragmento de Amatista" },
  copper_ingot:   { en: "Copper Ingot",     es: "Lingote de Cobre" },
  oak_slab:       { en: "Oak Slab",         es: "Losa de Roble" },
  stone_bricks:   { en: "Stone Bricks",     es: "Ladrillos de Piedra" },
  stone_brick_slab:{ en: "Stone Brick Slab", es: "Losa de Ladrillo de Piedra" },
  bricks:         { en: "Bricks",           es: "Ladrillos" },
  sandstone:      { en: "Sandstone",        es: "Arenisca" },
  book:           { en: "Book",             es: "Libro" },
  oak_log:        { en: "Oak Log",          es: "Tronco de Roble" }
};

/**
 * Get the display name for any ingredient id in a given language.
 * Checks RECIPES first (for craftable items), then INGREDIENT_NAMES.
 */
function getIngredientName(id, lang) {
  const recipe = RECIPES.find(r => r.id === id);
  if (recipe) return lang === "es" ? recipe.nameES : recipe.nameEN;
  if (INGREDIENT_NAMES[id]) return INGREDIENT_NAMES[id][lang] || INGREDIENT_NAMES[id].en || id;
  return id.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Get unique non-null ingredient ids from a recipe grid.
 */
function getRecipeIngredients(recipe) {
  const items = new Set();
  recipe.grid.forEach(row => row.forEach(cell => { if (cell) items.add(cell); }));
  return Array.from(items);
}
