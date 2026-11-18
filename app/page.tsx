'use client';

import { useEffect, useMemo, useState } from 'react';

type Product = { id: number; name: string; nameEn: string; category: string; price: number; oldPrice?: number; image: string; tag?: string; sizes: string[]; stock: number };
type CartLine = { product: Product; quantity: number; size: string };
type Copy = { [key: string]: string };

const initialProducts: Product[] = [
  { id: 1, name: 'قميص كتان واسع', nameEn: 'Relaxed linen shirt', category: 'ملابس', price: 249, oldPrice: 320, image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=85', tag: 'الأكثر مبيعًا', sizes: ['S', 'M', 'L', 'XL'], stock: 18 },
  { id: 2, name: 'فستان يومي انسيابي', nameEn: 'Everyday flow dress', category: 'فساتين', price: 389, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85', tag: 'جديد', sizes: ['XS', 'S', 'M', 'L'], stock: 12 },
  { id: 3, name: 'جاكيت دنيم كلاسيكي', nameEn: 'Classic denim jacket', category: 'ملابس', price: 459, oldPrice: 520, image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=85', sizes: ['S', 'M', 'L', 'XL'], stock: 7 },
  { id: 4, name: 'حقيبة كتف يومية', nameEn: 'Everyday shoulder bag', category: 'إكسسوارات', price: 199, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85', sizes: ['واحد'], stock: 24 },
  { id: 5, name: 'كنزة قطن ناعمة', nameEn: 'Soft cotton knit', category: 'ملابس', price: 329, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85', sizes: ['S', 'M', 'L'], stock: 15 },
  { id: 6, name: 'حذاء يومي مريح', nameEn: 'Comfort everyday shoes', category: 'أحذية', price: 279, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85', tag: 'اختيارنا', sizes: ['37', '38', '39', '40'], stock: 9 },
  { id: 7, name: 'تنورة ميدي مطوية', nameEn: 'Pleated midi skirt', category: 'فساتين', price: 299, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=85', sizes: ['XS', 'S', 'M', 'L'], stock: 11 },
  { id: 8, name: 'نظارة شمسية عصرية', nameEn: 'Modern sunglasses', category: 'إكسسوارات', price: 159, oldPrice: 190, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85', sizes: ['واحد'], stock: 30 },
];

const copy: Record<'ar' | 'en', Copy> = {
  ar: { announcement: 'توصيل مجاني للطلبات فوق ٣٠٠ ر.س', shop: 'تسوّق', story: 'قصتنا', contact: 'تواصل معنا', search: 'ابحث عن قطعة تحبها...', heroKicker: 'مجموعة الموسم الجديد', heroTitle: 'أساسيات جميلة\nلكل يوم.', heroText: 'قطع مختارة بعناية، مصممة لترافقك طويلًا. اكتشف أسلوبًا يشبهك.', shopNow: 'تسوّق المجموعة', discover: 'اكتشف المزيد', curated: 'اختياراتنا لك', collection: 'قطع تستحق مكانًا في خزانتك', all: 'الكل', clothes: 'ملابس', dresses: 'فساتين', accessories: 'إكسسوارات', shoes: 'أحذية', add: 'أضف للسلة', sold: 'نفد المخزون', bag: 'حقيبتك', empty: 'حقيبتك فارغة حاليًا', subtotal: 'المجموع الفرعي', shipping: 'الشحن', free: 'مجاني', checkout: 'إتمام الطلب', continue: 'متابعة التسوق', payment: 'طريقة الدفع', cod: 'الدفع عند الاستلام', card: 'بطاقة ائتمانية / مدى', apple: 'Apple Pay', checkoutNote: 'واجهة تجريبية — لن يتم تحصيل أي مبلغ فعليًا.', admin: 'إدارة المتجر', storefront: 'واجهة المتجر', adminTitle: 'لوحة تحكم المتجر', adminSub: 'نظرة سريعة على أداء متجرك اليوم.', revenue: 'مبيعات اليوم', orders: 'الطلبات', products: 'المنتجات', lowStock: 'مخزون منخفض', inventory: 'إدارة المنتجات', addProduct: 'إضافة منتج', product: 'المنتج', category: 'التصنيف', price: 'السعر', stock: 'المخزون', actions: 'الإجراء', edit: 'تعديل', delete: 'حذف', cancel: 'إلغاء', save: 'حفظ المنتج', newProduct: 'منتج جديد', name: 'اسم المنتج', imageUrl: 'رابط الصورة', sizes: 'المقاسات (افصل بينها بفاصلة)', saved: 'تم حفظ المنتج', removed: 'تم حذف المنتج', searchResults: 'نتائج البحث', noResults: 'لا توجد منتجات مطابقة', quantity: 'الكمية', total: 'الإجمالي', start: 'تسوق الآن', footer: 'اختيارات يومية، بذوق أبدي.', rights: '© 2025 NŪR Studio. صُنع بحب.' },
  en: { announcement: 'FREE SHIPPING ON ORDERS OVER SAR 300', shop: 'Shop', story: 'Our story', contact: 'Contact', search: 'Search for something you love...', heroKicker: 'THE NEW SEASON EDIT', heroTitle: 'Beautiful essentials\nfor every day.', heroText: 'Thoughtfully selected pieces, made to stay with you. Find a style that feels like you.', shopNow: 'Shop the collection', discover: 'Discover more', curated: 'CURATED FOR YOU', collection: 'Pieces worth making room for', all: 'All', clothes: 'Clothing', dresses: 'Dresses', accessories: 'Accessories', shoes: 'Shoes', add: 'Add to bag', sold: 'Out of stock', bag: 'Your bag', empty: 'Your bag is looking a little empty', subtotal: 'Subtotal', shipping: 'Shipping', free: 'Free', checkout: 'Checkout', continue: 'Continue shopping', payment: 'Payment method', cod: 'Cash on delivery', card: 'Credit / debit card', apple: 'Apple Pay', checkoutNote: 'Demo checkout — no payment will be charged.', admin: 'Store admin', storefront: 'Storefront', adminTitle: 'Store dashboard', adminSub: 'Here is what is happening with your store today.', revenue: 'Today’s sales', orders: 'Orders', products: 'Products', lowStock: 'Low stock', inventory: 'Product inventory', addProduct: 'Add product', product: 'Product', category: 'Category', price: 'Price', stock: 'Stock', actions: 'Actions', edit: 'Edit', delete: 'Delete', cancel: 'Cancel', save: 'Save product', newProduct: 'New product', name: 'Product name', imageUrl: 'Image URL', sizes: 'Sizes (comma separated)', saved: 'Product saved', removed: 'Product deleted', searchResults: 'Search results', noResults: 'No matching products', quantity: 'Qty', total: 'Total', start: 'Shop now', footer: 'Everyday pieces, forever your style.', rights: '© 2025 NŪR Studio. Made with care.' },
};

const categories = ['all', 'clothes', 'dresses', 'accessories', 'shoes'] as const;
const categoryAr: Record<string, string> = { 'ملابس': 'clothes', 'فساتين': 'dresses', 'إكسسوارات': 'accessories', 'أحذية': 'shoes' };

export default function Home() {
  const [locale, setLocale] = useState<'ar' | 'en'>('ar');
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [toast, setToast] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [checkoutDone, setCheckoutDone] = useState(false);
  const t = copy[locale];
  const isAr = locale === 'ar';

  useEffect(() => {
    const stored = localStorage.getItem('nur-products');
    if (stored) { try { setProducts(JSON.parse(stored) as Product[]); } catch { /* use starter catalog */ } }
  }, []);
  useEffect(() => { localStorage.setItem('nur-products', JSON.stringify(products)); }, [products]);
  useEffect(() => { document.documentElement.lang = locale; document.documentElement.dir = isAr ? 'rtl' : 'ltr'; }, [locale, isAr]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 2600); return () => clearTimeout(timer); }, [toast]);

  const filtered = useMemo(() => products.filter((p) => {
    const name = isAr ? p.name : p.nameEn;
    const categoryMatch = activeCategory === 'all' || (isAr ? categoryAr[p.category] === activeCategory : p.category === (activeCategory === 'clothes' ? 'Clothing' : activeCategory));
    const searchMatch = !query || `${p.name} ${p.nameEn} ${p.category}`.toLowerCase().includes(query.toLowerCase());
    return categoryMatch && searchMatch;
  }), [products, activeCategory, query, isAr]);
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const categoryLabel = (category: string) => {
    if (isAr) return category;
    const key = categoryAr[category] || 'clothes';
    return t[key] || category;
  };

  function addToCart(product: Product) {
    if (!product.stock) return;
    setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      return existing ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { product, quantity: 1, size: product.sizes[0] || 'One size' }];
    });
    setToast(isAr ? 'أضيف المنتج إلى حقيبتك' : 'Added to your bag');
  }
  function updateQuantity(id: number, amount: number) {
    setCart((current) => current.map((line) => line.product.id === id ? { ...line, quantity: line.quantity + amount } : line).filter((line) => line.quantity > 0));
  }
  function openForm(product?: Product) { setEditing(product || null); setFormOpen(true); }
  function saveProduct(formData: FormData) {
    const name = String(formData.get('name') || '').trim();
    if (!name) return;
    const product: Product = { id: editing?.id || Date.now(), name, nameEn: String(formData.get('nameEn') || name), category: String(formData.get('category') || 'ملابس'), price: Number(formData.get('price')) || 0, image: String(formData.get('image') || '') || initialProducts[0].image, stock: Number(formData.get('stock')) || 0, sizes: String(formData.get('sizes') || 'S, M, L').split(',').map((size) => size.trim()).filter(Boolean), ...(editing?.oldPrice ? { oldPrice: editing.oldPrice } : {}), ...(editing?.tag ? { tag: editing.tag } : {}) };
    setProducts((current) => editing ? current.map((item) => item.id === editing.id ? product : item) : [product, ...current]);
    setFormOpen(false); setToast(t.saved);
  }
  function deleteProduct(id: number) { setProducts((current) => current.filter((product) => product.id !== id)); setToast(t.removed); }
  function completeCheckout() { if (!cart.length) return; setCheckoutDone(true); }

  return (
    <main className={isAr ? 'site rtl' : 'site ltr'}>
      <div className="announcement"><span>{t.announcement}</span><span className="announcement-spark">✳</span><span>{isAr ? 'إرجاع سهل خلال ١٤ يومًا' : 'EASY 14-DAY RETURNS'}</span></div>
      <header className="header">
        <button className="mobile-menu" aria-label="Menu">☰</button>
        <nav className="nav-links"><a href="#collection">{t.shop}</a><a href="#story">{t.story}</a><a href="#contact">{t.contact}</a></nav>
        <a className="wordmark" href="#top">NŪR<span>STUDIO</span></a>
        <div className="header-tools"><label className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} /></label><button className="lang-button" onClick={() => setLocale(isAr ? 'en' : 'ar')}>{isAr ? 'EN' : 'عربي'}</button><button className="bag-button" onClick={() => { setCheckoutDone(false); setShowCart(true); }} aria-label={t.bag}><span className="bag-icon">♧</span><span className="bag-label">{t.bag}</span><span className="cart-count">{cartCount}</span></button></div>
      </header>
      <div className="view-switch"><button className={!admin ? 'selected' : ''} onClick={() => setAdmin(false)}>◉ {t.storefront}</button><button className={admin ? 'selected' : ''} onClick={() => setAdmin(true)}>▦ {t.admin}</button></div>

      {admin ? <section className="admin-page"><div className="admin-heading"><div><div className="eyebrow">NŪR STUDIO · OVERVIEW</div><h1>{t.adminTitle}</h1><p>{t.adminSub}</p></div><button className="primary-button" onClick={() => openForm()}>＋ {t.addProduct}</button></div>
        <div className="stats-grid"><div className="stat-card"><span className="stat-icon">↗</span><span>{t.revenue}</span><strong>٢٬٤٨٠ <small>SAR</small></strong><em>↑ ١٢٪ {isAr ? 'مقارنة بالأمس' : 'vs yesterday'}</em></div><div className="stat-card"><span className="stat-icon">▤</span><span>{t.orders}</span><strong>١٨</strong><em>↑ ٤ {isAr ? 'طلبات جديدة' : 'new orders'}</em></div><div className="stat-card"><span className="stat-icon">◇</span><span>{t.products}</span><strong>{products.length}</strong><em>{isAr ? 'في كتالوجك' : 'in your catalog'}</em></div><div className="stat-card"><span className="stat-icon warn">!</span><span>{t.lowStock}</span><strong>{products.filter((p) => p.stock < 10).length}</strong><em>{isAr ? 'تحتاج متابعة' : 'need attention'}</em></div></div>
        <div className="inventory-card"><div className="inventory-heading"><div><h2>{t.inventory}</h2><p>{isAr ? 'تابع منتجاتك ومخزونك من مكان واحد' : 'Manage your products and stock in one place'}</p></div><span className="product-count">{products.length} {t.products}</span></div><div className="table-wrap"><table><thead><tr><th>{t.product}</th><th>{t.category}</th><th>{t.price}</th><th>{t.stock}</th><th>{t.actions}</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><div className="table-product"><img src={product.image} alt="" /><div><strong>{isAr ? product.name : product.nameEn}</strong><small>SKU-{String(product.id).slice(-5)}</small></div></div></td><td>{categoryLabel(product.category)}</td><td>{product.price} SAR</td><td><span className={product.stock < 10 ? 'stock-pill low' : 'stock-pill'}>{product.stock} {isAr ? 'قطعة' : 'units'}</span></td><td><div className="row-actions"><button onClick={() => openForm(product)}>{t.edit}</button><button className="delete-action" onClick={() => deleteProduct(product.id)}>{t.delete}</button></div></td></tr>)}</tbody></table></div></div>
      </section> : <>
        <section className="hero" id="top"><div className="hero-image"/><div className="hero-content"><span className="hero-kicker"><i/> {t.heroKicker}</span><h1>{t.heroTitle}</h1><p>{t.heroText}</p><a className="hero-cta" href="#collection">{t.shopNow}<span>↗</span></a><span className="hero-index">01 — 04</span></div><div className="hero-caption">NŪR STUDIO · SPRING / SUMMER</div></section>
        <section className="collection section-wrap" id="collection"><div className="section-heading"><div><span className="eyebrow">{t.curated}</span><h2>{t.collection}</h2></div><a href="#collection" className="text-link">{t.discover} <span>↗</span></a></div><div className="category-tabs">{categories.map((category) => <button key={category} className={activeCategory === category ? 'active' : ''} onClick={() => setActiveCategory(category)}>{t[category]}</button>)}</div>
          {filtered.length ? <div className="product-grid">{filtered.map((product, index) => <article className="product-card" key={product.id}><div className="product-image-wrap"><img className="product-image" src={product.image} alt={isAr ? product.name : product.nameEn} loading={index > 3 ? 'lazy' : 'eager'} />{product.tag && <span className="product-tag">{product.tag}</span>}<button className="quick-add" onClick={() => addToCart(product)} disabled={!product.stock}>{product.stock ? `＋ ${t.add}` : t.sold}</button></div><div className="product-meta"><div><span className="product-category">{categoryLabel(product.category)}</span><h3>{isAr ? product.name : product.nameEn}</h3></div><div className="product-price">{product.price} <small>SAR</small>{product.oldPrice && <del>{product.oldPrice}</del>}</div></div><div className="size-row">{product.sizes.map((size) => <span key={size}>{size}</span>)}</div></article>)}</div> : <div className="no-results">{t.noResults}</div>}</section>
        <section className="story-banner" id="story"><div className="story-image"/><div className="story-copy"><span className="eyebrow">A LITTLE MORE CONSCIOUS</span><h2>{isAr ? 'أقل، لكن أفضل.' : 'Less, but better.'}</h2><p>{isAr ? 'نؤمن أن الأناقة الحقيقية تبدأ باختيارات مدروسة. نصمم قطعًا جميلة، عملية، وتدوم.' : 'We believe true style begins with thoughtful choices. Beautiful, practical pieces designed to last.'}</p><a href="#collection" className="text-link">{t.story} <span>↗</span></a></div></section>
      </>}
      <footer className="footer" id="contact"><a className="wordmark footer-mark" href="#top">NŪR<span>STUDIO</span></a><p>{t.footer}</p><span>{t.rights}</span></footer>

      {showCart && <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowCart(false); }}><aside className="cart-drawer"><div className="drawer-heading"><div><span className="eyebrow">NŪR STUDIO</span><h2>{checkoutDone ? (isAr ? 'شكرًا لطلبك!' : 'Thank you!') : t.bag} <small>({cartCount})</small></h2></div><button className="close-button" onClick={() => setShowCart(false)}>×</button></div>{checkoutDone ? <div className="success-state"><div>✓</div><h3>{isAr ? 'تم تسجيل طلبك التجريبي' : 'Your demo order is placed'}</h3><p>{isAr ? 'هذه معاينة فقط. لم يتم إرسال الطلب أو تحصيل أي مبلغ.' : 'This is a preview only. No order was submitted and no payment was charged.'}</p><button className="primary-button full" onClick={() => { setCart([]); setShowCart(false); setCheckoutDone(false); }}>{t.continue}</button></div> : cart.length === 0 ? <div className="empty-cart"><span>♧</span><p>{t.empty}</p><button className="primary-button" onClick={() => setShowCart(false)}>{t.start}</button></div> : <><div className="cart-lines">{cart.map(({ product, quantity, size }) => <div className="cart-line" key={product.id}><img src={product.image} alt=""/><div className="cart-line-info"><strong>{isAr ? product.name : product.nameEn}</strong><small>{isAr ? 'المقاس' : 'Size'}: {size}</small><div className="quantity-control"><button onClick={() => updateQuantity(product.id, -1)}>−</button><span>{quantity}</span><button onClick={() => updateQuantity(product.id, 1)}>＋</button></div></div><strong className="line-price">{product.price * quantity} SAR</strong></div>)}</div><div className="checkout-area"><div className="summary-row"><span>{t.subtotal}</span><strong>{subtotal} SAR</strong></div><div className="summary-row"><span>{t.shipping}</span><strong>{subtotal >= 300 ? t.free : '25 SAR'}</strong></div><div className="summary-row total-row"><span>{t.total}</span><strong>{subtotal + (subtotal >= 300 ? 0 : 25)} SAR</strong></div><div className="payment-title">{t.payment}</div><div className="payment-options"><label className={paymentMethod === 'cod' ? 'payment-option checked' : 'payment-option'}><input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')}/><span>◉</span>{t.cod}</label><label className={paymentMethod === 'card' ? 'payment-option checked' : 'payment-option'}><input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')}/><span>▰</span>{t.card}</label><label className={paymentMethod === 'apple' ? 'payment-option checked' : 'payment-option'}><input type="radio" name="payment" checked={paymentMethod === 'apple'} onChange={() => setPaymentMethod('apple')}/><span> Pay</span>{t.apple}</label></div><button className="primary-button full" onClick={completeCheckout}>{t.checkout}<span>↗</span></button><p className="demo-note">ⓘ {t.checkoutNote}</p></div></>}</aside></div>}

      {formOpen && <div className="overlay form-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setFormOpen(false); }}><form className="product-form" action={saveProduct}><div className="drawer-heading"><div><span className="eyebrow">INVENTORY</span><h2>{editing ? t.edit : t.newProduct}</h2></div><button type="button" className="close-button" onClick={() => setFormOpen(false)}>×</button></div><label>{t.name}<input name="name" required defaultValue={editing?.name}/></label><label>{isAr ? 'الاسم بالإنجليزية' : 'English name'}<input name="nameEn" defaultValue={editing?.nameEn}/></label><label>{t.category}<select name="category" defaultValue={editing?.category || 'ملابس'}><option value="ملابس">{isAr ? 'ملابس' : 'Clothing'}</option><option value="فساتين">{isAr ? 'فساتين' : 'Dresses'}</option><option value="إكسسوارات">{isAr ? 'إكسسوارات' : 'Accessories'}</option><option value="أحذية">{isAr ? 'أحذية' : 'Shoes'}</option></select></label><div className="form-two"><label>{t.price} (SAR)<input name="price" type="number" min="0" required defaultValue={editing?.price}/></label><label>{t.stock}<input name="stock" type="number" min="0" required defaultValue={editing?.stock}/></label></div><label>{t.imageUrl}<input name="image" type="url" defaultValue={editing?.image} placeholder="https://..."/></label><label>{t.sizes}<input name="sizes" defaultValue={editing?.sizes.join(', ') || 'S, M, L'}/></label><div className="form-actions"><button type="button" className="secondary-button" onClick={() => setFormOpen(false)}>{t.cancel}</button><button className="primary-button" type="submit">{t.save}</button></div></form></div>}
      {toast && <div className="toast">✓ &nbsp;{toast}</div>}
    </main>
  );
}
