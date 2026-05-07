import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const publicDir = './public'
const iconPath = path.join(publicDir, 'icon.svg')

const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-maskable-192.png', size: 192 },
  { name: 'icon-maskable-512.png', size: 512 },
]

async function generateIcons() {
  try {
    for (const { name, size } of sizes) {
      const outputPath = path.join(publicDir, name)
      await sharp(iconPath)
        .resize(size, size, {
          fit: 'fill',
          background: { r: 79, g: 70, b: 229, alpha: 1 },
        })
        .png()
        .toFile(outputPath)
      console.log(`✓ Generated ${name}`)
    }
    console.log('\nAll icons generated successfully!')
  } catch (error) {
    console.error('Error generating icons:', error.message)
    process.exit(1)
  }
}

generateIcons()
