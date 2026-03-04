-- ═══════════════════════════════════════════════════════════════════════════════
-- ELITA APPAREL – Seed Data
-- 10 products across multiple categories and collections
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── Categories ─────────────────────────────────────────────────────────────

INSERT INTO categories (name, slug) VALUES
  ('Two-Piece Sets', 'two-piece-sets'),
  ('Ready-to-Wear', 'ready-to-wear'),
  ('Dresses', 'dresses'),
  ('Skirts', 'skirts'),
  ('Tops', 'tops'),
  ('Accessories', 'accessories');

-- ─── Collections ────────────────────────────────────────────────────────────

INSERT INTO collections (name, slug, description, cultural_story, is_published) VALUES
  (
    'Independence Collection',
    'independence-collection',
    'Celebrate Ghana''s heritage with bold, statement-making pieces crafted from premium Kente and Ankara fabrics.',
    'Inspired by the spirit of March 6th, 1957 — when Ghana became the first sub-Saharan African country to gain independence. Each piece in this collection embodies the pride, resilience, and elegance of the Ghanaian people.',
    true
  ),
  (
    'Elegance Line',
    'elegance-line',
    'Refined silhouettes and sophisticated cuts for the modern African woman who commands attention with grace.',
    'Drawing from the timeless beauty of Ghanaian royal courts, the Elegance Line merges traditional craftsmanship with contemporary design, creating pieces worthy of queens.',
    true
  ),
  (
    'Heritage Edit',
    'heritage-edit',
    'A curated selection honoring traditional weaving techniques and regional patterns from across West Africa.',
    'Each pattern tells a story passed down through generations — from the symbolic Adinkra motifs to the vibrant Adire resist-dye techniques of the Yoruba people.',
    true
  );

-- ─── Products ───────────────────────────────────────────────────────────────

-- We need category and collection IDs, so we use subqueries
INSERT INTO products (name, slug, description, cultural_story, price, discount_percentage, category_id, collection_id, fabric_type, available_sizes, is_featured, is_new, early_bird_eligible, stock_quantity, is_published, seo_title, seo_description) VALUES
  (
    'Adire Royal Two-Piece',
    'adire-royal-two-piece',
    'A stunning two-piece set featuring hand-dyed Adire fabric with intricate indigo patterns. The structured peplum top pairs perfectly with the flowing wide-leg trousers for a look that commands both boardroom and evening events.',
    'Adire is a Yoruba word meaning "tied and dyed." This ancient textile art form dates back centuries and each pattern carries symbolic meaning. Our artisans use the resist-dyeing technique to create unique, one-of-a-kind patterns.',
    450.00, 10,
    (SELECT id FROM categories WHERE slug = 'two-piece-sets'),
    (SELECT id FROM collections WHERE slug = 'independence-collection'),
    'Adire', ARRAY['S','M','L','XL'], true, true, true, 15, true,
    'Adire Royal Two-Piece Set | Elita Apparel',
    'Premium hand-dyed Adire two-piece set with peplum top and wide-leg trousers. Authentic African fashion from Accra, Ghana.'
  ),
  (
    'Kente Empress Dress',
    'kente-empress-dress',
    'An elegant floor-length dress woven with authentic Kente cloth accents. Features a flattering wrap silhouette with hand-stitched gold threading along the bodice and a dramatic shoulder detail.',
    'Kente cloth originated with the Ashanti people of Ghana. Traditionally reserved for royalty, each color and pattern carries deep cultural significance. Gold symbolizes royalty and wealth; green represents renewal and growth.',
    680.00, 0,
    (SELECT id FROM categories WHERE slug = 'dresses'),
    (SELECT id FROM collections WHERE slug = 'elegance-line'),
    'Kente', ARRAY['XS','S','M','L','XL'], true, true, true, 8, true,
    'Kente Empress Dress | Elita Apparel',
    'Authentic Kente cloth floor-length dress with gold threading. Premium African fashion from Accra, Ghana.'
  ),
  (
    'Ankara Bloom Skirt',
    'ankara-bloom-skirt',
    'A vibrant midi skirt cut from bold Ankara print fabric with a modern A-line silhouette. Features a concealed side zip, lined interior, and a waist detail that accentuates your figure beautifully.',
    'Ankara prints, also known as African wax prints, tell visual stories. The bold blooming floral pattern on this skirt symbolizes growth, beauty, and the flourishing spirit of African womanhood.',
    280.00, 10,
    (SELECT id FROM categories WHERE slug = 'skirts'),
    (SELECT id FROM collections WHERE slug = 'heritage-edit'),
    'Ankara', ARRAY['S','M','L','XL','XXL'], false, true, true, 22, true,
    'Ankara Bloom Midi Skirt | Elita Apparel',
    'Vibrant Ankara print midi skirt with A-line silhouette. Premium African fashion from Accra, Ghana.'
  ),
  (
    'Dashiki Power Top',
    'dashiki-power-top',
    'A contemporary take on the classic Dashiki — reimagined as a structured blouse with tailored shoulders, French cuffs, and delicate embroidery around the neckline. Perfect for professional settings.',
    'The Dashiki has its roots in West African ceremonial garments. Its name derives from the Hausa word for shirt. We have reimagined this cultural staple for the modern professional woman.',
    220.00, 0,
    (SELECT id FROM categories WHERE slug = 'tops'),
    (SELECT id FROM collections WHERE slug = 'elegance-line'),
    'Dashiki', ARRAY['XS','S','M','L','XL'], false, true, false, 30, true,
    'Dashiki Power Top | Elita Apparel',
    'Contemporary Dashiki-inspired structured blouse with French cuffs. Premium African fashion from Accra, Ghana.'
  ),
  (
    'Golden Heritage Two-Piece',
    'golden-heritage-two-piece',
    'Luxurious two-piece ensemble featuring a cropped jacket with gold button detailing and matching high-waisted tailored trousers. Crafted from premium wax print fabric with metallic gold accents.',
    'The golden tones reflect the rich gold coast heritage of Ghana, once known as the Gold Coast. This set is a tribute to the wealth of our culture and the golden spirit of our people.',
    520.00, 10,
    (SELECT id FROM categories WHERE slug = 'two-piece-sets'),
    (SELECT id FROM collections WHERE slug = 'independence-collection'),
    'Wax Print', ARRAY['S','M','L','XL'], true, false, true, 12, true,
    'Golden Heritage Two-Piece Set | Elita Apparel',
    'Premium wax print two-piece with gold accents. Cropped jacket and tailored trousers. African fashion from Accra.'
  ),
  (
    'Batik Sunset Wrap Dress',
    'batik-sunset-wrap-dress',
    'A flowing wrap dress in hand-painted Batik fabric featuring warm sunset gradient tones. The adjustable wrap allows a customizable fit, while the midi length keeps it versatile for any occasion.',
    'Batik is an ancient wax-resist dyeing technique. Each piece is hand-painted by skilled artisans, making every dress truly unique — just like the sunsets over the Gulf of Guinea.',
    380.00, 0,
    (SELECT id FROM categories WHERE slug = 'dresses'),
    (SELECT id FROM collections WHERE slug = 'heritage-edit'),
    'Batik', ARRAY['S','M','L','XL'], false, false, false, 18, true,
    'Batik Sunset Wrap Dress | Elita Apparel',
    'Hand-painted Batik wrap dress in sunset tones. Premium African fashion from Accra, Ghana.'
  ),
  (
    'Kente Queen Two-Piece',
    'kente-queen-two-piece',
    'The crown jewel of our collection. Authentic hand-woven Kente from Bonwire paired with modern tailoring. Features a fitted blazer with satin lapels and matching pencil skirt with a thigh-high slit.',
    'Bonwire, a small town in the Ashanti Region, is the birthplace of Kente weaving. Each strip of Kente is hand-woven on wooden looms, a tradition dating back to the 17th century.',
    850.00, 0,
    (SELECT id FROM categories WHERE slug = 'two-piece-sets'),
    (SELECT id FROM collections WHERE slug = 'elegance-line'),
    'Kente', ARRAY['XS','S','M','L'], true, false, true, 5, true,
    'Kente Queen Two-Piece | Elita Apparel',
    'Hand-woven Kente blazer and pencil skirt set. Premium African fashion from Accra, Ghana.'
  ),
  (
    'Mud Cloth Legacy Top',
    'mud-cloth-legacy-top',
    'A contemporary crop top crafted from authentic Bògòlanfini (mud cloth) with geometric patterns in earthy tones. Structured cut with cap sleeves and a modern square neckline.',
    'Bògòlanfini, or mud cloth, originates from Mali. The fabric is hand-dyed using fermented mud, creating rich brown patterns that tell stories of hunters, warriors, and community.',
    195.00, 10,
    (SELECT id FROM categories WHERE slug = 'tops'),
    (SELECT id FROM collections WHERE slug = 'heritage-edit'),
    'Mud Cloth', ARRAY['XS','S','M','L','XL'], false, true, true, 25, true,
    'Mud Cloth Legacy Top | Elita Apparel',
    'Authentic mud cloth crop top with geometric patterns. Premium African fashion from Accra, Ghana.'
  ),
  (
    'Ankara Fusion Skirt',
    'ankara-fusion-skirt',
    'A bold statement skirt that fuses traditional Ankara patterns with a contemporary asymmetric hem. Features a comfortable elastic waistband with a decorative gold belt loop and full lining.',
    'This fusion design represents the evolution of African fashion — honoring ancestral patterns while embracing modern silhouettes. The asymmetric cut symbolizes movement and progress.',
    310.00, 0,
    (SELECT id FROM categories WHERE slug = 'skirts'),
    (SELECT id FROM collections WHERE slug = 'independence-collection'),
    'Ankara', ARRAY['S','M','L','XL','XXL'], false, false, false, 20, true,
    'Ankara Fusion Skirt | Elita Apparel',
    'Bold Ankara asymmetric midi skirt with gold detail. Premium African fashion from Accra, Ghana.'
  ),
  (
    'Aso Oke Regal Dress',
    'aso-oke-regal-dress',
    'A breathtaking occasion dress crafted from hand-woven Aso Oke fabric with intricate strip-weave patterns. Features a dramatic off-shoulder neckline, fitted bodice, and mermaid skirt with a chapel train.',
    'Aso Oke, meaning "top cloth" in Yoruba, is a hand-woven fabric traditionally worn on important occasions. Its creation requires extraordinary skill and patience, with each strip taking days to complete.',
    950.00, 10,
    (SELECT id FROM categories WHERE slug = 'dresses'),
    (SELECT id FROM collections WHERE slug = 'elegance-line'),
    'Aso Oke', ARRAY['XS','S','M','L'], true, true, true, 3, true,
    'Aso Oke Regal Dress | Elita Apparel',
    'Hand-woven Aso Oke mermaid dress with chapel train. Premium African fashion from Accra, Ghana.'
  );

-- ─── Product Images ─────────────────────────────────────────────────────────
-- Using placeholder URLs — replace with actual Supabase Storage URLs after upload

INSERT INTO product_images (product_id, image_url, position, is_primary)
SELECT id, 'https://placehold.co/800x1000/1A1A1A/C6A75E?text=Adire+Royal', 0, true FROM products WHERE slug = 'adire-royal-two-piece'
UNION ALL
SELECT id, 'https://placehold.co/800x1000/1A1A1A/C6A75E?text=Kente+Empress', 0, true FROM products WHERE slug = 'kente-empress-dress'
UNION ALL
SELECT id, 'https://placehold.co/800x1000/1A1A1A/C6A75E?text=Ankara+Bloom', 0, true FROM products WHERE slug = 'ankara-bloom-skirt'
UNION ALL
SELECT id, 'https://placehold.co/800x1000/1A1A1A/C6A75E?text=Dashiki+Power', 0, true FROM products WHERE slug = 'dashiki-power-top'
UNION ALL
SELECT id, 'https://placehold.co/800x1000/1A1A1A/C6A75E?text=Golden+Heritage', 0, true FROM products WHERE slug = 'golden-heritage-two-piece'
UNION ALL
SELECT id, 'https://placehold.co/800x1000/1A1A1A/C6A75E?text=Batik+Sunset', 0, true FROM products WHERE slug = 'batik-sunset-wrap-dress'
UNION ALL
SELECT id, 'https://placehold.co/800x1000/1A1A1A/C6A75E?text=Kente+Queen', 0, true FROM products WHERE slug = 'kente-queen-two-piece'
UNION ALL
SELECT id, 'https://placehold.co/800x1000/1A1A1A/C6A75E?text=Mud+Cloth', 0, true FROM products WHERE slug = 'mud-cloth-legacy-top'
UNION ALL
SELECT id, 'https://placehold.co/800x1000/1A1A1A/C6A75E?text=Ankara+Fusion', 0, true FROM products WHERE slug = 'ankara-fusion-skirt'
UNION ALL
SELECT id, 'https://placehold.co/800x1000/1A1A1A/C6A75E?text=Aso+Oke+Regal', 0, true FROM products WHERE slug = 'aso-oke-regal-dress';

-- ─── Discount Codes ─────────────────────────────────────────────────────────

INSERT INTO discount_codes (code, percentage, expiry_date, is_active, max_uses) VALUES
  ('EARLYBIRD10', 10, now() + interval '90 days', true, 100),
  ('INDEPENDENCE15', 15, '2026-03-31'::timestamptz, true, 50),
  ('WELCOME5', 5, null, true, null);
