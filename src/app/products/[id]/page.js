import { supabase } from '../../../lib/supabase'
import ProductDetailClient from './ProductDetailClient'

// This file is intentionally a Server Component (no 'use client') — Next.js
// only allows generateMetadata() in Server Components, and this is what makes
// each product page show its own real title/description in Google search
// results instead of every product sharing the site-wide default. All the
// actual interactive UI (cart, variant selector, gallery, etc.) still lives
// in ProductDetailClient.js exactly as before — nothing about the page's
// behavior changes, only where the file boundary sits.
export async function generateMetadata({ params }) {
  const { id } = await params

  const { data: product } = await supabase
    .from('products')
    .select('name, description, image, brand')
    .eq('id', id)
    .single()

  if (!product) {
    return {
      title: 'Product Not Found | US Supplements',
      description: 'The product you are looking for could not be found.',
    }
  }

  const description = product.description
    ? product.description.slice(0, 155)
    : `Buy ${product.name}${product.brand ? ` by ${product.brand}` : ''} online. 100% authentic, verified brand partner, free delivery above ₹499.`

  return {
    title: `${product.name} | US Supplements`,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.image ? [{ url: product.image }] : [],
    },
  }
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params
  return <ProductDetailClient id={id} />
}