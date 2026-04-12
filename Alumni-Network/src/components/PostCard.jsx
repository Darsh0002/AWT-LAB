import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Heart, Share2, MoreHorizontal } from "lucide-react";

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(
    post.likes || Math.floor(Math.random() * 50),
  );

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[2.5rem] shadow-lg border border-slate-100 p-8 mb-8 group hover:shadow-2xl transition-all duration-500"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-black text-xs uppercase group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-500">
            {post.author?.name?.charAt(0) || "A"}
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-900 font-outfit tracking-tight leading-none uppercase">
              {post.author?.name || "Anonymous Member"}
            </h4>
            <div className="flex items-center gap-2 mt-1.5 font-bold text-slate-400 text-[10px] tracking-widest uppercase">
              <span className="w-1 h-1 rounded-full bg-slate-200" />
              <span>
                {new Date(post.createdAt || Date.now()).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric" },
                )}
              </span>
            </div>
          </div>
        </div>
        <button className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <p className="text-slate-600 text-lg leading-relaxed mb-8 font-medium italic">
        "{post.content}"
      </p>

      {post.image && (
        <div className="mb-8 rounded-[2rem] overflow-hidden border border-slate-100 shadow-md">
          <img src={post.image} className="w-full h-auto" />
        </div>
      )}

      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest ${liked ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}
          >
            <Heart size={16} fill={liked ? "currentColor" : "none"} />
            {likeCount}
          </button>
          <button className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest">
            <MessageSquare size={16} />
            {post.comments || 0}
          </button>
        </div>
        <button className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
          <Share2 size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default PostCard;
