import React, { useState } from 'react';
import { ContentPost } from '../types';

interface ContentLibraryProps {
  posts: ContentPost[];
  onAddPost: (preview: string, topTrigger: ContentPost['topTrigger'], mediaType: ContentPost['mediaType']) => void;
  onActionNotification: (message: string) => void;
  onTriggerGeminiDraft: (topic: string) => Promise<string>;
}

export default function ContentLibraryView({
  posts,
  onAddPost,
  onActionNotification,
  onTriggerGeminiDraft,
}: ContentLibraryProps) {
  const [isComposing, setIsComposing] = useState(false);
  const [postTopic, setPostTopic] = useState('');
  const [postDraft, setPostDraft] = useState('');
  const [triggerType, setTriggerType] = useState<ContentPost['topTrigger']>('DM CTA');
  const [mediaType, setMediaType] = useState<ContentPost['mediaType']>('image');
  const [draftingAi, setDraftingAi] = useState(false);

  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postDraft.trim()) {
      alert("Please enter draft content!");
      return;
    }
    onAddPost(postDraft, triggerType, mediaType);
    setIsComposing(false);
    setPostTopic('');
    setPostDraft('');
    onActionNotification("Draft created in Content Library!");
  };

  const handleGenerateAiDraft = async () => {
    if (!postTopic.trim()) {
      onActionNotification("Please enter a topic or keyword first!");
      return;
    }
    setDraftingAi(true);
    onActionNotification(`Invoking Gemini LLM engine to compose viral coaching framework...`);
    try {
      const generated = await onTriggerGeminiDraft(postTopic);
      setPostDraft(generated);
      onActionNotification("Gemini viral draft loaded successfully!");
    } catch (err) {
      onActionNotification(`Gemini offline or error: ${(err as Error).message}`);
    } finally {
      setDraftingAi(false);
    }
  };

  return (
    <div className="space-y-6" style={{ marginTop: '5px', paddingTop: '4px', paddingLeft: '12px' }}>
      {/* Top Header */}
      <header 
        className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 py-4 md:py-0 px-6 sticky top-0 bg-[#faf9f8] z-30 md:h-16 shadow-sm -mx-6 mb-2 border-b border-[#c6c5d5] w-auto"
        style={{
          paddingLeft: '26px',
          marginLeft: '-36px',
          marginTop: '-6px',
          marginBottom: '13px',
          paddingTop: '15px',
          paddingBottom: '0px',
          height: '102.025px'
        }}
      >
        {/* Left: Title side with horizontal offset shift */}
        <div className="flex items-center">
          <h2 
            className="text-xl font-bold text-[#4450b7] pl-14"
            style={{
              marginTop: '-3px',
              marginLeft: '-36px',
              paddingTop: '1px',
              fontSize: '16px',
              textAlign: 'left',
              width: '180.312px',
              height: '26px'
            }}
          >
            Library
          </h2>
        </div>

        {/* Center: Placeholder for uniform columns */}
        <div className="hidden md:block"></div>

        {/* Right: Actions */}
        <div 
          className="flex items-center gap-4 w-full md:w-auto justify-end shrink-0"
          style={{ marginTop: '-12px' }}
        >
          <button 
            type="button"
            onClick={() => setIsComposing(true)}
            className="bg-[#4450b7] hover:opacity-90 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-sm font-bold">add_circle</span>
            <span>Compose Post</span>
          </button>
        </div>
      </header>

      {/* Primary Table container matching image precisely */}
      <div className="bg-white rounded-xl card-shadow border border-[#c6c5d5] overflow-hidden" style={{ marginTop: '9px' }}>
        <div className="px-5 py-4 border-b border-[#c6c5d5] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1a1c1c]">My Organic Inbound Channels</h3>
          <p className="text-[11px] text-[#5f5e5c] font-medium">Auto-scrapes engagement triggers from social feeds</p>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f4f3f2] border-b border-[#c6c5d5]">
              <th className="px-6 py-3.5 text-[11px] font-bold text-[#5f5e5c] uppercase tracking-wider w-16">Media</th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-[#5f5e5c] uppercase tracking-wider w-32">Date</th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-[#5f5e5c] uppercase tracking-wider text-center w-24">Reactions</th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-[#5f5e5c] uppercase tracking-wider text-center w-24">Comments</th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-[#5f5e5c] uppercase tracking-wider text-center w-24">Reposts</th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-[#5f5e5c] uppercase tracking-wider text-center w-24">DMs</th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-[#5f5e5c] uppercase tracking-wider w-36">Top Trigger</th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-[#5f5e5c] uppercase tracking-wider">Preview</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c6c5d5]">
            {posts.map((post) => (
              <tr 
                key={post.id} 
                className="hover:bg-[#f4f3f2]/30 transition-colors group cursor-pointer"
              >
                <td className="px-6 py-4 text-center">
                  <span className={`material-symbols-outlined ${
                    post.mediaType === 'image'
                      ? 'text-primary'
                      : post.mediaType === 'description'
                      ? 'text-tertiary font-bold'
                      : 'text-error font-medium'
                  }`}>
                    {post.mediaType === 'image' ? 'image' : post.mediaType === 'description' ? 'description' : 'tag'}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-[#1a1c1c] whitespace-nowrap">
                  {post.date}
                </td>
                <td className="px-6 py-4 text-center text-xs font-mono font-bold text-[#1a1c1c]">
                  {post.reactions}
                </td>
                <td className="px-6 py-4 text-center text-xs font-mono font-bold text-[#1a1c1c]">
                  {post.comments}
                </td>
                <td className="px-6 py-4 text-center text-xs font-mono font-bold text-[#1a1c1c]">
                  {post.reposts}
                </td>
                <td className="px-6 py-4 text-center text-xs font-mono font-bold text-[#4450b7]">
                  {post.dms}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 text-[10px] rounded-full uppercase font-bold border ${
                    post.topTrigger === 'DM CTA'
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : post.topTrigger === 'Educational'
                      ? 'bg-purple-100 text-purple-800 border-purple-200'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}>
                    {post.topTrigger}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-[#5f5e5c] italic max-w-sm truncate">
                  {post.preview}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Composition Modal with Gemini Integrations */}
      {isComposing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form 
            onSubmit={handleComposeSubmit}
            className="bg-white rounded-xl shadow-xl max-w-xl w-full overflow-hidden border border-[#c6c5d5] animate-in fade-in zoom-in duration-200"
          >
            <div className="px-6 py-4 bg-[#f4f3f2] border-b border-[#c6c5d5] flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#1a1c1c] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#4450b7]">auto_awesome</span>
                Compose Post Draft
              </h3>
              <button 
                type="button" 
                onClick={() => setIsComposing(false)}
                className="text-[#5f5e5c] hover:text-[#1a1c1c] active:scale-90"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            
            <div className="p-6 space-y-4 text-xs font-semibold">
              <div className="bg-[#5e6ad2]/5 p-3.5 rounded-xl border border-[#4450b7]/10 space-y-2">
                <label className="text-[10px] text-[#4450b7] uppercase font-bold tracking-wider block">
                  Gemini Viral Post Draft Generator
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 3 pricing framework hooks for 2026..."
                    value={postTopic}
                    onChange={(e) => setPostTopic(e.target.value)}
                    className="flex-1 p-2 bg-white border border-[#c6c5d5] rounded-lg"
                  />
                  <button
                    type="button"
                    disabled={draftingAi}
                    onClick={handleGenerateAiDraft}
                    className="bg-[#4450b7] hover:opacity-90 disabled:opacity-50 text-white font-bold px-3.5 py-2 rounded-lg text-xs leading-none shrink-0"
                  >
                    {draftingAi ? 'Writing...' : 'Generate AI'}
                  </button>
                </div>
                <p className="text-[10px] text-[#5f5e5c]">Connects to Google Gemini server-side to compose templates instantly.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-[#5f5e5c] uppercase font-bold tracking-wider block">
                  Post Content Preview / Draft Editor
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Paste your content draft or let Gemini populate..."
                  value={postDraft}
                  onChange={(e) => setPostDraft(e.target.value)}
                  className="w-full p-3 bg-white border border-[#c6c5d5]/80 rounded-xl font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-[#5f5e5c] uppercase font-bold tracking-wider block">Trigger Mechanism</label>
                  <select
                    value={triggerType}
                    onChange={(e) => setTriggerType(e.target.value as ContentPost['topTrigger'])}
                    className="w-full p-2 bg-[#f4f3f2] border border-[#c6c5d5] rounded-xl font-medium"
                  >
                    <option value="DM CTA">DM CTA (e.g. comment "BOOK")</option>
                    <option value="Keyword">Keyword Match (e.g. comment "SCRIPTS")</option>
                    <option value="Educational">No Auto-Trigger (Pure Educational)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#5f5e5c] uppercase font-bold tracking-wider block">Media Attachment</label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value as ContentPost['mediaType'])}
                    className="w-full p-2 bg-[#f4f3f2] border border-[#c6c5d5] rounded-xl font-medium"
                  >
                    <option value="image">Single Image / Carousel</option>
                    <option value="description">Longform Article Only</option>
                    <option value="tag">Snippet Badge / Tag Only</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-[#f4f3f2] border-t border-[#c6c5d5] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsComposing(false)}
                className="bg-transparent hover:bg-[#efeeed] text-[#5f5e5c] px-4 py-2 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#4450b7] hover:opacity-90 text-white px-4 py-2 font-bold text-xs rounded-xl"
              >
                Publish & Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
