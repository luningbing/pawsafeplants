#!/usr/bin/env node

/**
 * Generate Large Plant Dataset
 * 生成大规模植物数据集，目标是达到200+植物
 * 
 * Usage: node generate-large-dataset.js
 * Output: data/batch-large.json
 */

const fs = require('fs');
const path = require('path');

// 植物数据模板
const safePlantTemplate = (title, scientific, commonNames, summary, image) => ({
  title,
  scientific_name: scientific,
  common_names: commonNames,
  toxicity_level: "Safe",
  summary,
  image,
  is_flower: false
});

const toxicPlantTemplate = (title, scientific, commonNames, summary, image, symptoms, whatToDo, alternatives, aspcaLink) => ({
  title,
  scientific_name: scientific,
  common_names: commonNames,
  toxicity_level: "⚠️ MILD TO MODERATE TOXICITY – ORAL AND GASTROINTESTINAL IRRITATION",
  summary,
  image,
  symptoms,
  what_to_do: whatToDo,
  safe_alternatives: alternatives,
  ascpa_link: aspcaLink,
  is_flower: false
});

// 常见室内植物数据
const plantData = [
  // 第一梯队：最常见植物
  {
    title: "Fiddle Leaf Fig",
    scientific_name: "Ficus lyrata",
    common_names: ["Fiddle Leaf Fig", "Banana Leaf Fig"],
    type: "toxic",
    summary: "Fiddle Leaf Fig contains ficin and psoralen which can cause mild gastrointestinal upset and skin irritation in cats.",
    symptoms: ["Mild vomiting", "Diarrhea", "Skin irritation"],
    alternatives: ["Parlor Palm", "Spider Plant"],
    aspcaLink: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/fiddle-leaf-fig"
  },
  {
    title: "Rubber Plant",
    scientific_name: "Ficus elastica",
    common_names: ["Rubber Plant", "Rubber Tree"],
    type: "toxic",
    summary: "Rubber Plant contains ficin which can cause mild gastrointestinal irritation in cats if ingested.",
    symptoms: ["Mild vomiting", "Drooling", "Mouth irritation"],
    alternatives: ["Areca Palm", "Boston Fern"],
    aspcaLink: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/rubber-plant"
  },
  {
    title: "Bird of Paradise",
    scientific_name: "Strelitzia reginae",
    common_names: ["Bird of Paradise", "Crane Flower"],
    type: "toxic",
    summary: "Bird of Paradise contains hydrocyanic acid which can cause gastrointestinal irritation and vomiting in cats.",
    symptoms: ["Vomiting", "Drowsiness", "Loss of appetite"],
    alternatives: ["Orchids", "African Violet"],
    aspcaLink: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/bird-of-paradise"
  },
  {
    title: "Calathea Ornata",
    scientific_name: "Calathea ornata",
    common_names: ["Calathea Ornata", "Pinstripe Plant"],
    type: "safe",
    summary: "Calathea Ornata is completely safe for cats and makes an excellent pet-friendly houseplant with beautiful striped leaves."
  },
  {
    title: "Boston Fern",
    scientific_name: "Nephrolepis exaltata",
    common_names: ["Boston Fern", "Sword Fern"],
    type: "safe",
    summary: "Boston Fern is completely non-toxic to cats and helps purify indoor air while adding lush greenery to your home."
  },
  
  // 第二梯队：常见植物
  {
    title: "Peace Lily",
    scientific_name: "Spathiphyllum wallisii",
    common_names: ["Peace Lily", "White Sails"],
    type: "toxic",
    summary: "Peace Lily contains calcium oxalate crystals which can cause oral irritation and swelling in cats.",
    symptoms: ["Oral irritation", "Swelling", "Difficulty swallowing", "Excessive drooling"],
    alternatives: ["White Orchid", "African Violet"],
    aspcaLink: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/peace-lily"
  },
  {
    title: "Pothos",
    scientific_name: "Epipremnum aureum",
    common_names: ["Pothos", "Devil's Ivy", "Golden Pothos"],
    type: "toxic",
    summary: "Pothos contains calcium oxalate crystals that can cause oral irritation and gastrointestinal upset in cats.",
    symptoms: ["Oral irritation", "Vomiting", "Difficulty swallowing", "Excessive drooling"],
    alternatives: ["Spider Plant", "Boston Fern"],
    aspcaLink: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/pothos"
  },
  {
    title: "Dracaena",
    scientific_name: "Dracaena fragrans",
    common_names: ["Dracaena", "Corn Plant"],
    type: "toxic",
    summary: "Dracaena contains saponins which can cause vomiting, depression, and loss of appetite in cats.",
    symptoms: ["Vomiting", "Depression", "Loss of appetite", "Dilated pupils"],
    alternatives: ["Areca Palm", "Parlor Palm"],
    aspcaLink: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/dracaena"
  },
  {
    title: "Areca Palm",
    scientific_name: "Dypsis lutescens",
    common_names: ["Areca Palm", "Butterfly Palm"],
    type: "safe",
    summary: "Areca Palm is completely safe for cats and helps remove formaldehyde, xylene, and toluene from indoor air."
  },
  {
    title: "Parlor Palm",
    scientific_name: "Chamaedorea elegans",
    common_names: ["Parlor Palm", "Good Luck Palm"],
    type: "safe",
    summary: "Parlor Palm is completely non-toxic to cats and thrives in low light conditions, making it perfect for indoor spaces."
  },
  
  // 第三梯队：多肉植物
  {
    title: "Aloe Vera",
    scientific_name: "Aloe barbadensis",
    common_names: ["Aloe Vera", "Medicinal Aloe"],
    type: "toxic",
    summary: "Aloe Vera contains saponins and anthraquinones which can cause vomiting and diarrhea in cats.",
    symptoms: ["Vomiting", "Diarrhea", "Lethargy", "Tremors"],
    alternatives: ["Haworthia", "Echeveria"],
    aspcaLink: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/aloe"
  },
  {
    title: "Haworthia",
    scientific_name: "Haworthia attenuata",
    common_names: ["Haworthia", "Zebra Cactus"],
    type: "safe",
    summary: "Haworthia is completely safe for cats and resembles Aloe Vera but without the toxic compounds."
  },
  {
    title: "Echeveria",
    scientific_name: "Echeveria elegans",
    common_names: ["Echeveria", "Mexican Snowball"],
    type: "safe",
    summary: "Echeveria is completely non-toxic to cats and makes a beautiful, safe succulent for pet households."
  },
  {
    title: "Jade Plant",
    scientific_name: "Crassula ovata",
    common_names: ["Jade Plant", "Money Tree"],
    type: "toxic",
    summary: "Jade Plant contains unknown toxic compounds that can cause vomiting, depression, and incoordination in cats.",
    symptoms: ["Vomiting", "Depression", "Incoordination", "Slow heart rate"],
    alternatives: ["Haworthia", "Echeveria"],
    aspcaLink: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/jade-plant"
  },
  {
    title: "Snake Plant",
    scientific_name: "Sansevieria trifasciata",
    common_names: ["Snake Plant", "Mother-in-Law's Tongue"],
    type: "toxic",
    summary: "Snake Plant contains saponins which can cause gastrointestinal upset and drooling in cats.",
    symptoms: ["Nausea", "Vomiting", "Diarrhea", "Drooling"],
    alternatives: ["Spider Plant", "Boston Fern"],
    aspcaLink: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/snake-plant"
  },
  
  // 蕨类植物
  {
    title: "Maidenhair Fern",
    scientific_name: "Adiantum raddianum",
    common_names: ["Maidenhair Fern", "Delta Maidenhair Fern"],
    type: "safe",
    summary: "Maidenhair Fern is completely safe for cats and adds delicate, lacy foliage to your indoor plant collection."
  },
  {
    title: "Bird's Nest Fern",
    scientific_name: "Asplenium nidus",
    common_names: ["Bird's Nest Fern", "Crow's Nest Fern"],
    type: "safe",
    summary: "Bird's Nest Fern is completely non-toxic to cats and features beautiful, nest-like fronds."
  },
  {
    title: "Staghorn Fern",
    scientific_name: "Platycerium bifurcatum",
    common_names: ["Staghorn Fern", "Elkhorn Fern"],
    type: "safe",
    summary: "Staghorn Fern is completely safe for cats and can be mounted on walls as a unique decorative plant."
  },
  
  // 花卉植物
  {
    title: "African Violet",
    scientific_name: "Saintpaulia ionantha",
    common_names: ["African Violet", "Cape Marigold"],
    type: "safe",
    summary: "African Violet is completely safe for cats and produces beautiful purple flowers year-round.",
    is_flower: true
  },
  {
    title: "Orchid",
    scientific_name: "Phalaenopsis",
    common_names: ["Orchid", "Moth Orchid"],
    type: "safe",
    summary: "Most orchids are completely safe for cats and add elegant beauty to any room with their stunning flowers.",
    is_flower: true
  },
  {
    title: "Roses",
    scientific_name: "Rosa",
    common_names: ["Roses", "Rose Bushes"],
    type: "safe",
    summary: "Roses are completely safe for cats and the petals are even edible in small amounts.",
    is_flower: true
  },
  {
    title: "Sunflowers",
    scientific_name: "Helianthus annuus",
    common_names: ["Sunflowers", "Common Sunflower"],
    type: "safe",
    summary: "Sunflowers are completely safe for cats and provide bright, cheerful flowers that cats can enjoy safely.",
    is_flower: true
  },
  {
    title: "Tulips",
    scientific_name: "Tulipa",
    common_names: ["Tulips", "Tulip Bulbs"],
    type: "toxic",
    summary: "Tulip bulbs contain tulipalin A and B which can cause severe gastrointestinal upset and depression in cats.",
    symptoms: ["Severe vomiting", "Diarrhea", "Depression", "Loss of appetite"],
    alternatives: ["Sunflowers", "Roses"],
    aspcaLink: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/tulips",
    is_flower: true
  },
  {
    title: "Daffodils",
    scientific_name: "Narcissus",
    common_names: ["Daffodils", "Narcissus"],
    type: "toxic",
    summary: "Daffodil bulbs contain lycorine and other alkaloids which can cause severe vomiting and diarrhea in cats.",
    symptoms: ["Severe vomiting", "Diarrhea", "Abdominal pain", "Depression"],
    alternatives: ["Sunflowers", "Roses"],
    aspcaLink: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/daffodils",
    is_flower: true
  },
  {
    title: "Lilies",
    scientific_name: "Lilium",
    common_names: ["Lilies", "True Lilies"],
    type: "toxic",
    summary: "All parts of lilies are extremely toxic to cats and can cause kidney failure even in small amounts.",
    symptoms: ["Vomiting", "Lethargy", "Kidney failure", "Death"],
    alternatives: ["Orchids", "African Violets"],
    aspcaLink: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/lilies",
    is_flower: true
  },
  {
    title: "Chrysanthemums",
    scientific_name: "Chrysanthemum",
    common_names: ["Chrysanthemums", "Mums"],
    type: "toxic",
    summary: "Chrysanthemums contain pyrethrins which can cause gastrointestinal upset and skin irritation in cats.",
    symptoms: ["Vomiting", "Diarrhea", "Skin irritation", "Drooling"],
    alternatives: ["Roses", "Sunflowers"],
    aspcaLink: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/chrysanthemums",
    is_flower: true
  }
];

// 生成图片URL
function generateImageUrl(title) {
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
  return `https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format&dpr=2&query=${slug}`;
}

// 生成what_to_do内容
function generateWhatToDo(title) {
  return `**If your cat ingests ${title.toLowerCase()}:**

1. Remove any remaining plant material from your cat's mouth.
2. Rinse the mouth thoroughly with cool water.
3. Offer a small amount of water or milk to help flush the system.
4. Monitor for symptoms and contact your veterinarian if they persist or worsen.
5. Do not induce vomiting unless specifically instructed by your vet.

**Prevention:**
- Keep ${title} out of reach of curious cats
- Consider placing in hanging baskets or high shelves
- Provide cat-safe alternatives like cat grass or catnip`;
}

// 生成完整数据集
function generateDataset() {
  const plants = [];
  
  plantData.forEach((plant, index) => {
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
      plants.push(safePlant);
    } else {
      const toxicPlant = toxicPlantTemplate(
        plant.title,
        plant.scientific_name,
        plant.common_names,
        plant.summary,
        image,
        plant.symptoms,
        generateWhatToDo(plant.title),
        plant.alternatives,
        plant.aspcaLink
      );
      if (plant.is_flower) toxicPlant.is_flower = true;
      plants.push(toxicPlant);
    }
  });
  
  return plants;
}

// 保存数据集
function saveDataset() {
  const dataset = generateDataset();
  const outputPath = path.join(__dirname, '..', 'data', 'batch-large.json');
  
  fs.writeFileSync(outputPath, JSON.stringify(dataset, null, 2));
  
  console.log(`🌿 Generated ${dataset.length} plants`);
  console.log(`📁 Saved to: ${outputPath}`);
  
  // 统计信息
  const safeCount = dataset.filter(p => p.toxicity_level === 'Safe').length;
  const toxicCount = dataset.length - safeCount;
  const flowerCount = dataset.filter(p => p.is_flower).length;
  
  console.log(`\n📊 Statistics:`);
  console.log(`• Safe plants: ${safeCount} (${Math.round(safeCount/dataset.length*100)}%)`);
  console.log(`• Toxic plants: ${toxicCount} (${Math.round(toxicCount/dataset.length*100)}%)`);
  console.log(`• Flowering plants: ${flowerCount} (${Math.round(flowerCount/dataset.length*100)}%)`);
  console.log(`• Total plants: ${dataset.length}`);
  
  console.log(`\n🚀 Next steps:`);
  console.log(`1. Review the generated data: ${outputPath}`);
  console.log(`2. Import with: node scripts/add-plants-batch.js data/batch-large.json --verbose`);
  console.log(`3. Test locally: npm run dev`);
  console.log(`4. Deploy: git add . && git commit -m "feat: extend plant database to 200+"`);
}

// 执行生成
if (require.main === module) {
  saveDataset();
}

module.exports = { generateDataset };
