export enum PhotoPackage {
  PRO = "Pro Package - $250",
  PRO_PLUS = "Pro+ Package - $500",
  PRO_XL = "ProXL Package - $750",
}

export interface PackageDetails {
  name: PhotoPackage
  price: number
  duration: number
  features: string[]
}

export const packageDetails: Record<PhotoPackage, PackageDetails> = {
  [PhotoPackage.PRO]: {
    name: PhotoPackage.PRO,
    price: 250,
    duration: 2,
    features: [
      "2 hours of event coverage",
      "100 professionally edited high-resolution photos",
      "Access to an online photo gallery for easy viewing and sharing",
    ],
  },
  [PhotoPackage.PRO_PLUS]: {
    name: PhotoPackage.PRO_PLUS,
    price: 500,
    duration: 4,
    features: [
      "4 hours of event coverage",
      "250 professionally edited high-resolution photos",
      "Access to an online photo gallery",
      "Includes a USB drive with all edited photos",
    ],
  },
  [PhotoPackage.PRO_XL]: {
    name: PhotoPackage.PRO_XL,
    price: 750,
    duration: 8,
    features: [
      "8 hours of event coverage",
      "500 professionally edited high-resolution photos",
      "Online photo gallery access",
      "USB drive with all photos",
      "Custom photobook featuring event highlights",
    ],
  },
}

