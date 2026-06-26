import React, { useState } from 'react';
import { FileText, Plus, Eye, Edit3, Trash2, Search, Globe } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  status: 'draft' | 'published';
  createdAt: number;
}

// #17 Blog SEO
export const BlogTab: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([
    { id: '1', title: 'Cách chọn gia sư Toán giỏi cho con lớp 12', slug: 'cach-chon-gia-su-toan-lop-12', excerpt: 'Hướng dẫn phụ huynh tiêu chí chọn gia sư Toán phù hợp cho con luyện thi đại học.', content: 'Chọn gia sư Toán giỏi là bước quan trọng giúp con bạn tự tin bước vào kỳ thi...', category: 'Tư vấn', status: 'published', createdAt: Date.now() - 86400000 },
    { id: '2', title: '5 sai lầm phổ biến khi tìm gia sư tiếng Anh', slug: '5-sai-lam-tim-gia-su-tieng-anh', excerpt: 'Tránh các sai lầm thường gặp để tìm được gia sư tiếng Anh chất lượng.', content: 'Nhiều phụ huynh thường mắc sai lầm khi chọn gia sư tiếng Anh...', category: 'Tư vấn', status: 'published', createdAt: Date.now() - 172800000 },
    { id: '3', title: 'Lợi ích của học online so với học tại nhà', slug: 'loi-ich-hoc-online-vs-tai-nha', excerpt: 'So sánh hai hình thức học để phụ huynh lựa chọn phù hợp.', content: 'Với sự phát triển của công nghệ, học online ngày càng phổ biến...', category: 'Giáo dục', status: 'draft', createdAt: Date.now() - 259200000 },
  ]);
  const [showEditor, setShowEditor] = useState(false);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Tư vấn');

  const filtered = posts
    .filter(p => !searchTerm || p.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b.createdAt - a.createdAt);

  const handleSave = () => {
    if (!title) return;
    const slug = title.toLowerCase().replace(/[^a-z0-9\u00C0-\u024F]/gi, '-').replace(/-+/g, '-');
    if (editPost) {
      setPosts(posts.map(p => p.id === editPost.id ? { ...p, title, excerpt, content, category, slug } : p));
    } else {
      setPosts([...posts, { id: Date.now().toString(), title, slug, excerpt, content, category, status: 'draft', createdAt: Date.now() }]);
    }
    closeEditor();
  };

  const closeEditor = () => { setShowEditor(false); setEditPost(null); setTitle(''); setExcerpt(''); setContent(''); };
  const openEdit = (p: BlogPost) => { setEditPost(p); setTitle(p.title); setExcerpt(p.excerpt); setContent(p.content); setCategory(p.category); setShowEditor(true); };
  const togglePublish = (id: string) => setPosts(posts.map(p => p.id === id ? { ...p, status: p.status === 'published' ? 'draft' : 'published' } : p));

  return (
    <div className="col-span-12 space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Globe className="w-5 h-5 text-green-600" /> Blog & Nội dung SEO</h2>
          <p className="text-xs text-slate-500 mt-0.5">{posts.length} bài viết · {posts.filter(p => p.status === 'published').length} đã xuất bản</p>
        </div>
        <button onClick={() => setShowEditor(true)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-2 shadow-md shadow-green-600/20"><Plus className="w-4 h-4" /> Bài viết mới</button>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Tìm bài viết..."
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500" />
      </div>

      <div className="space-y-3">
        {filtered.map(post => (
          <div key={post.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-green-200 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-slate-800">{post.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${post.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {post.status === 'published' ? '✅ Xuất bản' : '📝 Nháp'}
                  </span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold">{post.category}</span>
                </div>
                <p className="text-xs text-slate-500 mb-1">{post.excerpt}</p>
                <p className="text-[10px] text-slate-400">/{post.slug} · {new Date(post.createdAt).toLocaleDateString('vi-VN')}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => togglePublish(post.id)} className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg cursor-pointer" title={post.status === 'published' ? 'Ẩn' : 'Xuất bản'}><Eye className="w-3.5 h-3.5" /></button>
                <button onClick={() => openEdit(post)} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg cursor-pointer"><Edit3 className="w-3.5 h-3.5" /></button>
                <button onClick={() => window.confirm('Xóa bài viết?') && setPosts(posts.filter(p => p.id !== post.id))} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-scale-in max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-800 mb-4">{editPost ? 'Sửa bài viết' : 'Bài viết mới'}</h3>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Tiêu đề *</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="VD: Cách chọn gia sư Toán giỏi..."
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Danh mục</label>
                  <select value={category} onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500">
                    <option>Tư vấn</option><option>Giáo dục</option><option>Chia sẻ</option><option>Tin tức</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Tóm tắt (SEO)</label>
                <input value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Mô tả ngắn cho Google..."
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Nội dung</label>
                <textarea rows={10} value={content} onChange={e => setContent(e.target.value)} placeholder="Viết nội dung bài viết..."
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={closeEditor} className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 cursor-pointer">Hủy</button>
                <button onClick={handleSave} className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold cursor-pointer">Lưu bài viết</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
