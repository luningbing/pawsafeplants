#!/usr/bin/env node

/**
 * Find and Update Plant Images
 * 查找并更新植物图片
 * 
 * Usage: node find-plant-images.js [--update]
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const matter = require('gray-matter');

const PLANTS_DIR = path.join(process.cwd(), 'content', 'plants');

// 植物图片映射表 - 使用高质量的免费图片
const plantImageMap = {
  // 安全植物
  "spider-plant": "https://images.unsplash.com/photo-1416879595882-d33bcbe8c131?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "spider-plant-variegated": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "boston-fern": "https://images.unsplash.com/photo-1520184597163-54c66695b382?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "boston-fern-compacta": "https://images.unsplash.com/photo-1501004318641-b398d68e866b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "areca-palm": "https://images.unsplash.com/photo-1520302618106-4e2f8dc772b1?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "parlor-palm": "https://images.unsplash.com/photo-1543168256-739e5d9d537a?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "bamboo-palm": "https://images.unsplash.com/photo-1512428813834-69c3432058ce?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "cast-iron-plant": "https://images.unsplash.com/photo-1577173175952-d4c018c6915f?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "swedish-ivy": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "polka-dot-plant": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "prayer-plant": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "prayer-plant-green": "https://images.unsplash.com/photo-1543168256-739e5d9d537a?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "prayer-plant-red": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "wax-plant": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "peperomia": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "friendship-plant": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "aluminum-plant": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "venus-flytrap": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "sensitive-plant": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "baby-tears": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "christmas-cactus": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "geranium": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "petunia": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "zinnia": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "marigold": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "impatiens": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "cat-grass": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "zz-plant": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "money-tree": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "pilea-peperomioides": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "string-of-hearts": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "burros-tail": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "catnip": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "valerian": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "lemongrass": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "mint": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "parsley": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "rosemary": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "thyme": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "cilantro": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "dill": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "chamomile": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "lavender": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "sage": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "oregano": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "marjoram": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "chives": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "wheatgrass": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "barley-grass": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "alfalfa-sprouts": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "bromeliad": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "air-plant": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "corn-plant": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "yucca": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "norfolk-pine": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "ficus-alii": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "ficus-benjamina": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "schefflera": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "aglaonema": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "dieffenbachia-compacta": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "philodendron-selloum": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "philodendron-congo": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "monstera-adansonii": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "string-of-pearls": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "string-of-bananas": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "donkeys-tail": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "panda-plant": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "pencil-cactus": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "crown-of-thorns": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "desert-rose": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "hibiscus": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "gardenia": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "camellia": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "daphne": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "forsythia": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "lilac": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "hydrangea": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "peony": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "dahlia": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "canna": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "gladiolus": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "iris": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "crocus": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "snowdrop": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "bluebell": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "foxglove": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "snapdragon": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "sweet-pea": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "nasturtium": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "viola": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "pansy": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "cosmos": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "coreopsis": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "coneflower": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "black-eyed-susan": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "shasta-daisy": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "yarrow": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "bee-balm": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "salvia": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "verbena": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "lantana": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "fuchsia": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "coleus": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "caladium": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "fittonia": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "maranta-leuconeura": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "ctenanthe": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "stromanthe": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "calathea-lancifolia": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "calathea-medallion": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "calathea-zebrina": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "calathea-makoyana": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "calathea-rufibarba": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "calathea-orbifolia": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "calathea-vittata": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "calathea-white-fusion": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "calathea-network": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "calathea-dottie": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "calathea-white-star": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "calathea-freddie": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "calathea-jungle-velvet": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "calathea-beauty-star": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "calathea-corona": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "calathea-eternal-flame": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "calathea-loeseneri": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "calathea-veitchiana": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "calathea-zebrina-compact": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "peperomia-watermelon": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "peperomia-ripple": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "peperomia-ginny": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "peperomia-marble": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "peperomia-hope": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "peperomia-prostrata": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "peperomia-ruby-glow": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "peperomia-variegata": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "pilea-cadierei-minima": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "pilea-glauca": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "pilea-spruceana": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "pilea-moon-valley": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "pilea-norfolk": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "pilea-silver": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "pilea-dark-mystery": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "pilea-involucrata-friendship": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "pilea-microphylla": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "pilea-depressa": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "pilea-cadierei-variegata": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  
  // 有毒植物
  "peace-lily": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "pothos": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "dracaena": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "aloe-vera": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "haworthia": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "echeveria": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "jade-plant": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "snake-plant": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "english-ivy": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "dieffenbachia": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "sago-palm": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "oleander": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "azalea": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "cyclamen": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "kalanchoe": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "yew": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "tomato-plant": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "potato-plant": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "fiddle-leaf-fig": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "rubber-plant": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "bird-of-paradise": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "calathea-ornata": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "lilies": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "tulips": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "daffodils": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "chrysanthemums": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "roses": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "sunflowers": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "african-violet": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "orchid": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "croton": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "begonia": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "maidenhair-fern": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "birds-nest-fern": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "staghorn-fern": "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format",
  "air-plants": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format&dpr=2&query=air%20plants",
  "anthurium": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format&dpr=2&query=anthurium",
  "baby-rubber-plant": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format&dpr=2&query=baby%20rubber%20plant",
  "basil": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format&dpr=2&query=basil",
  "birds-nest-fern-victoria": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format&dpr=2&query=birds%20nest%20fern%20victoria",
  "bromeliads": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format&dpr=2&query=bromeliads",
  "calathea": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format&dpr=2&query=calathea",
  "carnations": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format&dpr=2&query=carnations",
  "hoya": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format&dpr=2&query=hoya",
  "kalanchoe-blossfeldiana": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format&dpr=2&query=kalanchoe%20blossfeldiana",
  "lily": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format&dpr=2&query=lily",
  "lipstick-plant": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format&dpr=2&query=lipstick%20plant",
  "maidenhair-fern-delta": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format&dpr=2&query=maidenhair%20fern%20delta",
  "monstera": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format&dpr=2&query=monstera",
  "moth-orchid": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format&dpr=2&query=moth%20orchid",
  "norfolk-island-pine": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format&dpr=2&query=norfolk%20island%20pine",
  "philodendron": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format&dpr=2&query=philodendron",
  "ponytail-palm": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format&dpr=2&query=ponytail%20palm",
  "staghorn-fern-small": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format&dpr=2&query=staghorn%20fern%20small",
  "zebra-plant": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format&dpr=2&query=zebra%20plant"
};

// 获取所有植物文件
function getAllPlantFiles() {
  const files = fs.readdirSync(PLANTS_DIR).filter(file => file.endsWith('.md'));
  return files.map(file => file.replace('.md', ''));
}

// 更新植物图片
function updatePlantImages(update = false) {
  const plantFiles = getAllPlantFiles();
  let updatedCount = 0;
  let missingCount = 0;
  
  console.log(`🌿 Found ${plantFiles.length} plant files`);
  console.log('');
  
  plantFiles.forEach(slug => {
    const filePath = path.join(PLANTS_DIR, `${slug}.md`);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: markdownContent } = matter(content);
    
    if (plantImageMap[slug]) {
      const newImageUrl = plantImageMap[slug];
      
      if (data.image !== newImageUrl) {
        if (update) {
          // 更新图片
          data.image = newImageUrl;
          const updatedContent = matter.stringify(markdownContent, data);
          fs.writeFileSync(filePath, updatedContent);
          console.log(`✅ Updated: ${slug}.md`);
          updatedCount++;
        } else {
          console.log(`📸 Found image for: ${slug}.md`);
          console.log(`   Current: ${data.image || 'No image'}`);
          console.log(`   New: ${newImageUrl}`);
          console.log('');
        }
      }
    } else {
      console.log(`❌ No image found for: ${slug}.md`);
      missingCount++;
    }
  });
  
  console.log(`\n📊 Summary:`);
  if (update) {
    console.log(`✅ Updated: ${updatedCount} plants`);
  } else {
    console.log(`📸 Plants with images: ${plantFiles.length - missingCount}`);
    console.log(`❌ Plants missing images: ${missingCount}`);
  }
  console.log(`📱 Total plants: ${plantFiles.length}`);
  
  if (!update && missingCount > 0) {
    console.log(`\n🔧 To update images, run: node find-plant-images.js --update`);
  }
}

// 生成缺失的图片URL
function generateMissingImageUrls() {
  const plantFiles = getAllPlantFiles();
  const missingPlants = [];
  
  plantFiles.forEach(slug => {
    if (!plantImageMap[slug]) {
      missingPlants.push(slug);
    }
  });
  
  if (missingPlants.length > 0) {
    console.log(`🔍 Generating URLs for ${missingPlants.length} missing plants:`);
    console.log('');
    
    missingPlants.forEach(slug => {
      const imageUrl = `https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format&dpr=2&query=${slug.replace(/-/g, '%20')}`;
      console.log(`"${slug}": "${imageUrl}",`);
    });
  } else {
    console.log(`✅ All plants have images mapped!`);
  }
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  const update = args.includes('--update');
  const generate = args.includes('--generate');
  
  console.log('🖼️  Plant Image Finder & Updater');
  console.log('');
  
  if (generate) {
    generateMissingImageUrls();
  } else {
    updatePlantImages(update);
  }
}

// 执行
if (require.main === module) {
  main();
}

module.exports = { updatePlantImages, generateMissingImageUrls };
