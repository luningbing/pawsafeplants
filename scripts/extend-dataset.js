#!/usr/bin/env node

/**
 * Extend Plant Dataset
 * 扩展植物数据集，添加更多植物以达到200+目标
 */

const fs = require('fs');
const path = require('path');

// 读取现有的batch-large.json
const existingData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'batch-large.json'), 'utf8'));

// 更多植物数据
const additionalPlants = [
  // 更多安全植物
  {
    title: "Spider Plant",
    scientific_name: "Chlorophytum comosum",
    common_names: ["Spider Plant", "Airplane Plant"],
    type: "safe",
    summary: "Spider Plant is completely safe for cats and helps purify indoor air while producing baby spiderettes."
  },
  {
    title: "Bamboo Palm",
    scientific_name: "Chamaedorea seifrizii",
    common_names: ["Bamboo Palm", "Reed Palm"],
    type: "safe",
    summary: "Bamboo Palm is completely non-toxic to cats and helps remove formaldehyde and benzene from indoor air."
  },
  {
    title: "Cast Iron Plant",
    scientific_name: "Aspidistra elatior",
    common_names: ["Cast Iron Plant", "Iron Plant"],
    type: "safe",
    summary: "Cast Iron Plant is completely safe for cats and is extremely hardy, thriving in low light conditions."
  },
  {
    title: "Swedish Ivy",
    scientific_name: "Plectranthus verticillatus",
    common_names: ["Swedish Ivy", "Swedish Begonia"],
    type: "safe",
    summary: "Swedish Ivy is completely safe for cats and produces cascading vines with attractive foliage."
  },
  {
    title: "Polka Dot Plant",
    scientific_name: "Hypoestes phyllostachya",
    common_names: ["Polka Dot Plant", "Freckle Face"],
    type: "safe",
    summary: "Polka Dot Plant is completely safe for cats and features colorful spotted leaves."
  },
  {
    title: "Prayer Plant",
    scientific_name: "Maranta leuconeura",
    common_names: ["Prayer Plant", "Praying Maranta"],
    type: "safe",
    summary: "Prayer Plant is completely safe for cats and folds its leaves at night like praying hands."
  },
  {
    title: "Wax Plant",
    scientific_name: "Hoya carnosa",
    common_names: ["Wax Plant", "Hoya"],
    type: "safe",
    summary: "Wax Plant is completely safe for cats and produces waxy, star-shaped flowers."
  },
  {
    title: "Peperomia",
    scientific_name: "Peperomia obtusifolia",
    common_names: ["Peperomia", "Baby Rubber Plant"],
    type: "safe",
    summary: "Peperomia is completely safe for cats and comes in many varieties with interesting foliage."
  },
  {
    title: "Friendship Plant",
    scientific_name: "Pilea involucrata",
    common_names: ["Friendship Plant", "Pilea"],
    type: "safe",
    summary: "Friendship Plant is completely safe for cats and features textured, deeply veined leaves."
  },
  {
    title: "Aluminum Plant",
    scientific_name: "Pilea cadierei",
    common_names: ["Aluminum Plant", "Watermelon Pilea"],
    type: "safe",
    summary: "Aluminum Plant is completely safe for cats and has silvery markings on its leaves."
  },
  {
    title: "Venus Flytrap",
    scientific_name: "Dionaea muscipula",
    common_names: ["Venus Flytrap", "Flytrap"],
    type: "safe",
    summary: "Venus Flytrap is completely safe for cats and is a fascinating carnivorous plant."
  },
  {
    title: "Sensitive Plant",
    scientific_name: "Mimosa pudica",
    common_names: ["Sensitive Plant", "Touch-Me-Not"],
    type: "safe",
    summary: "Sensitive Plant is completely safe for cats and folds its leaves when touched."
  },
  {
    title: "Baby Tears",
    scientific_name: "Soleirolia soleirolii",
    common_names: ["Baby Tears", "Mind-Your-Own-Business"],
    type: "safe",
    summary: "Baby Tears is completely safe for cats and forms a dense carpet of tiny leaves."
  },
  {
    title: "Christmas Cactus",
    scientific_name: "Schlumbergera truncata",
    common_names: ["Christmas Cactus", "Holiday Cactus"],
    type: "safe",
    summary: "Christmas Cactus is completely safe for cats and produces beautiful flowers during winter.",
    is_flower: true
  },
  {
    title: "Geranium",
    scientific_name: "Pelargonium",
    common_names: ["Geranium", "Scented Geranium"],
    type: "safe",
    summary: "Geranium is completely safe for cats and produces colorful flowers with pleasant scents.",
    is_flower: true
  },
  {
    title: "Petunia",
    scientific_name: "Petunia",
    common_names: ["Petunia", "Petunias"],
    type: "safe",
    summary: "Petunia is completely safe for cats and produces abundant, colorful flowers.",
    is_flower: true
  },
  {
    title: "Zinnia",
    scientific_name: "Zinnia elegans",
    common_names: ["Zinnia", "Zinnias"],
    type: "safe",
    summary: "Zinnia is completely safe for cats and produces bright, daisy-like flowers.",
    is_flower: true
  },
  {
    title: "Marigold",
    scientific_name: "Tagetes",
    common_names: ["Marigold", "French Marigold"],
    type: "safe",
    summary: "Marigold is completely safe for cats and produces bright orange or yellow flowers.",
    is_flower: true
  },
  {
    title: "Impatiens",
    scientific_name: "Impatiens walleriana",
    common_names: ["Impatiens", "Busy Lizzy"],
    type: "safe",
    summary: "Impatiens is completely safe for cats and produces colorful flowers in shade.",
    is_flower: true
  },

  // 更多有毒植物
  {
    title: "English Ivy",
    scientific_name: "Hedera helix",
    common_names: ["English Ivy", "Common Ivy"],
    type: "toxic",
    summary: "English Ivy contains triterpenoid saponins which can cause vomiting, diarrhea, and abdominal pain in cats.",
    symptoms: ["Vomiting", "Diarrhea", "Abdominal pain", "Excessive drooling"],
    alternatives: ["Swedish Ivy", "Spider Plant"],
    aspcaLink: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/english-ivy"
  },
  {
    title: "Dieffenbachia",
    scientific_name: "Dieffenbachia seguine",
    common_names: ["Dieffenbachia", "Dumb Cane"],
    type: "toxic",
    summary: "Dieffenbachia contains calcium oxalate crystals which can cause severe oral irritation and swelling in cats.",
    symptoms: ["Oral irritation", "Swelling", "Difficulty swallowing", "Excessive drooling"],
    alternatives: ["Prayer Plant", "Peperomia"],
    aspcaLink: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/dieffenbachia"
  },
  {
    title: "Sago Palm",
    scientific_name: "Cycas revoluta",
    common_names: ["Sago Palm", "King Sago"],
    type: "toxic",
    summary: "Sago Palm contains cycasin which is extremely toxic to cats and can cause liver failure and death.",
    symptoms: ["Vomiting", "Diarrhea", "Liver failure", "Death"],
    alternatives: ["Areca Palm", "Parlor Palm"],
    aspcaLink: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/sago-palm"
  },
  {
    title: "Oleander",
    scientific_name: "Nerium oleander",
    common_names: ["Oleander", "Rose Bay"],
    type: "toxic",
    summary: "Oleander contains cardiac glycosides which are extremely toxic to cats and can cause fatal heart problems.",
    symptoms: ["Vomiting", "Diarrhea", "Heart problems", "Death"],
    alternatives: ["Hibiscus", "Rose"],
    aspcaLink: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/oleander",
    is_flower: true
  },
  {
    title: "Azalea",
    scientific_name: "Rhododendron",
    common_names: ["Azalea", "Rhododendron"],
    type: "toxic",
    summary: "Azalea contains grayanotoxins which can cause severe vomiting, diarrhea, and cardiovascular problems in cats.",
    symptoms: ["Severe vomiting", "Diarrhea", "Heart problems", "Coma"],
    alternatives: ["Camellia", "Gardenia"],
    aspcaLink: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/azalea",
    is_flower: true
  },
  {
    title: "Cyclamen",
    scientific_name: "Cyclamen persicum",
    common_names: ["Cyclamen", "Persian Violet"],
    type: "toxic",
    summary: "Cyclamen contains cyclamine which can cause severe vomiting and diarrhea in cats.",
    symptoms: ["Severe vomiting", "Diarrhea", "Heart problems", "Death"],
    alternatives: ["African Violet", "Primrose"],
    aspcaLink: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/cyclamen",
    is_flower: true
  },
  {
    title: "Kalanchoe",
    scientific_name: "Kalanchoe blossfeldiana",
    common_names: ["Kalanchoe", "Flaming Katy"],
    type: "toxic",
    summary: "Kalanchoe contains bufadienolides which can cause severe vomiting and heart problems in cats.",
    symptoms: ["Severe vomiting", "Diarrhea", "Heart problems", "Death"],
    alternatives: ["Christmas Cactus", "Sedum"],
    aspcaLink: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/kalanchoe",
    is_flower: true
  },
  {
    title: "Yew",
    scientific_name: "Taxus",
    common_names: ["Yew", "English Yew"],
    type: "toxic",
    summary: "Yew contains taxine which is extremely toxic to cats and can cause sudden death without warning.",
    symptoms: ["Sudden death", "Heart problems", "Tremors", "Seizures"],
    alternatives: ["Arborvitae", "Holly"],
    aspcaLink: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/yew"
  },
  {
    title: "Tomato Plant",
    scientific_name: "Solanum lycopersicum",
    common_names: ["Tomato Plant", "Tomato"],
    type: "toxic",
    summary: "Tomato plants contain solanine and tomatine which can cause gastrointestinal upset in cats.",
    symptoms: ["Vomiting", "Diarrhea", "Lethargy", "Weakness"],
    alternatives: ["Basil", "Catnip"],
    aspcaLink: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/tomato"
  },
  {
    title: "Potato Plant",
    scientific_name: "Solanum tuberosum",
    common_names: ["Potato Plant", "Potato"],
    type: "toxic",
    summary: "Potato plants contain solanine which can cause gastrointestinal upset and neurological symptoms in cats.",
    symptoms: ["Vomiting", "Diarrhea", "Lethargy", "Weakness"],
    alternatives: ["Sweet Potato Vine", "Catnip"],
    aspcaLink: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/potato"
  }
];

// 植物模板
const safePlantTemplate = (title, scientific, commonNames, summary, image) => ({
  title,
  scientific_name: scientific,
  common_names: commonNames,
  toxicity_level: "Safe",
  summary,
  image,
  is_flower: false
});

const toxicPlantTemplate = (title, scientific, commonNames, summary, image, symptoms, alternatives, aspcaLink) => ({
  title,
  scientific_name: scientific,
  common_names: commonNames,
  toxicity_level: "⚠️ MILD TO MODERATE TOXICITY – ORAL AND GASTROINTESTINAL IRRITATION",
  summary,
  image,
  symptoms,
  what_to_do: `**If your cat ingests ${title.toLowerCase()}:**

1. Remove any remaining plant material from your cat's mouth.
2. Rinse the mouth thoroughly with cool water.
3. Offer a small amount of water or milk to help flush the system.
4. Monitor for symptoms and contact your veterinarian if they persist or worsen.
5. Do not induce vomiting unless specifically instructed by your vet.

**Prevention:**
- Keep ${title} out of reach of curious cats
- Consider placing in hanging baskets or high shelves
- Provide cat-safe alternatives like cat grass or catnip`,
  safe_alternatives: alternatives,
  ascpa_link: aspcaLink,
  is_flower: false
});

// 生成图片URL
function generateImageUrl(title) {
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
  return `https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format&dpr=2&query=${slug}`;
}

// 生成扩展数据集
function generateExtendedDataset() {
  const newPlants = [];
  
  additionalPlants.forEach(plant => {
    const image = generateImageUrl(plant.title);
    
    if (plant.type === 'safe') {
      const safePlant = safePlantTemplate(
        plant.title,
        plant.scientific_name,
        plant.common_names,
        plant.summary,
        image
      );
      if (plant.is_flower) safePlant.is_flower = true;
      newPlants.push(safePlant);
    } else {
      const toxicPlant = toxicPlantTemplate(
        plant.title,
        plant.scientific_name,
        plant.common_names,
        plant.summary,
        image,
        plant.symptoms,
        plant.alternatives,
        plant.aspcaLink
      );
      if (plant.is_flower) toxicPlant.is_flower = true;
      newPlants.push(toxicPlant);
    }
  });
  
  return [...existingData, ...newPlants];
}

// 保存扩展数据集
function saveExtendedDataset() {
  const extendedDataset = generateExtendedDataset();
  const outputPath = path.join(__dirname, '..', 'data', 'batch-extended.json');
  
  fs.writeFileSync(outputPath, JSON.stringify(extendedDataset, null, 2));
  
  console.log(`🌿 Extended dataset to ${extendedDataset.length} plants`);
  console.log(`📁 Saved to: ${outputPath}`);
  
  // 统计信息
  const safeCount = extendedDataset.filter(p => p.toxicity_level === 'Safe').length;
  const toxicCount = extendedDataset.length - safeCount;
  const flowerCount = extendedDataset.filter(p => p.is_flower).length;
  
  console.log(`\n📊 Extended Statistics:`);
  console.log(`• Safe plants: ${safeCount} (${Math.round(safeCount/extendedDataset.length*100)}%)`);
  console.log(`• Toxic plants: ${toxicCount} (${Math.round(toxicCount/extendedDataset.length*100)}%)`);
  console.log(`• Flowering plants: ${flowerCount} (${Math.round(flowerCount/extendedDataset.length*100)}%)`);
  console.log(`• Total plants: ${extendedDataset.length}`);
  
  console.log(`\n🚀 Next steps:`);
  console.log(`1. Review the extended data: ${outputPath}`);
  console.log(`2. Import with: node scripts/add-plants-batch.js data/batch-extended.json --verbose`);
  console.log(`3. Test locally: npm run dev`);
  console.log(`4. Deploy: git add . && git commit -m "feat: extend plant database to 200+"`);
}

// 执行扩展
if (require.main === module) {
  saveExtendedDataset();
}

module.exports = { generateExtendedDataset };
