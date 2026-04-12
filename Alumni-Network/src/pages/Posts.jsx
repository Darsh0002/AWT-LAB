import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Heart,
  Share2,
  MoreHorizontal,
  Plus,
  Search,
  TrendingUp,
  Award,
  Users,
  Image as ImageIcon,
  FileText,
  Calendar,
  X,
  Send,
  Sparkles,
  MapPin,
  Clock,
} from "lucide-react";
import PostCard from "../components/PostCard";

// Premium Profile Card
const ProfileCard = ({ user }) => (
  <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden group">
    <div className="h-28 bg-gradient-to-br from-indigo-500 to-indigo-700 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 group-hover:scale-110 transition-transform duration-700">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
      </div>
    </div>
    <div className="p-8 pt-0 text-center relative">
      <div className="w-24 h-24 rounded-[2rem] bg-indigo-50 border-4 border-white mx-auto -mt-12 flex items-center justify-center text-indigo-600 shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
        {user?.avatar ? (
          <img src={user.avatar} className="w-full h-full object-cover" />
        ) : (
          <Users size={32} />
        )}
      </div>
      <h3 className="text-xl font-black mt-4 text-slate-900 font-outfit uppercase tracking-tight">
        {user?.full_name || "Community Member"}
      </h3>
      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1 mb-6">
        {user?.role || "Scholar"}
      </p>

      <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-6">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
            Network
          </p>
          <p className="text-lg font-black text-slate-900 font-outfit">1.2k</p>
        </div>
        <div>
          <p className="text-[10px) font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
            Rank
          </p>
          <p className="text-lg font-black text-slate-900 font-outfit">
            Top 5%
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Main Feed Management
export default function Posts() {
  const {
    posts,
    user,
    fetchFeed,
    students,
    fetchInstituteStudents,
    createPost,
  } = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFeed();
    fetchInstituteStudents();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    setLoading(true);
    const result = await createPost({ content: postContent });
    setLoading(false);

    if (result.success) {
      setPostContent("");
      setShowModal(false);
    } else {
      alert(result.error || "Failed to create post");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 font-inter">
      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-48 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -mr-40 -mt-40" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] -ml-20 -mb-20" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-black uppercase tracking-[0.2em] mb-8 backdrop-blur-md">
              <Sparkles size={14} className="animate-pulse" /> Community Feed
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 font-outfit tracking-tight">
              Share Knowledge.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                Stay Connected.
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
              Your global stage for professional updates, career advice, and
              community stories.
            </p>

            <div className="flex flex-wrap justify-center gap-8">
              {[
                {
                  label: "Community Posts",
                  value: posts.length + "+",
                  icon: MessageSquare,
                },
                {
                  label: "Active Members",
                  value: (students.length || "500") + "+",
                  icon: Users,
                },
                { label: "Daily Reach", value: "200+", icon: TrendingUp },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
                >
                  <stat.icon size={24} className="text-indigo-400" />
                  <div className="text-left">
                    <p className="text-white font-black text-xl leading-none font-outfit">
                      {stat.value}
                    </p>
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-1">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Static Sidebar */}
          <aside className="lg:col-span-1 hidden lg:block space-y-8">
            <div className="sticky top-28">
              <ProfileCard user={user} />

              <div className="mt-8 p-8 bg-white rounded-[2rem] shadow-xl border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                    <TrendingUp size={20} />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 font-outfit uppercase tracking-tight">
                    Trending
                  </h4>
                </div>
                <div className="space-y-5">
                  {[
                    { tag: "#CareerMilestones", growth: "+12%" },
                    { tag: "#ResumeAudit", growth: "+8%" },
                    { tag: "#GlobalMeetup", growth: "+21%" },
                  ].map((topic, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center group cursor-pointer"
                    >
                      <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                        {topic.tag}
                      </span>
                      <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg">
                        {topic.growth}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Social Feed */}
          <main className="lg:col-span-2 space-y-10">
            {/* Create Post Action */}
            <div
              onClick={() => setShowModal(true)}
              className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 flex items-center gap-6 group cursor-pointer hover:border-indigo-100 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 transition-transform group-hover:scale-105">
                <Plus size={24} />
              </div>
              <span className="text-slate-400 font-bold text-lg uppercase tracking-tight flex-grow">
                Start a conversation...
              </span>
              <div className="flex gap-2">
                <div className="p-3 rounded-xl hover:bg-slate-50 text-indigo-400">
                  <ImageIcon size={20} />
                </div>
                <div className="p-3 rounded-xl hover:bg-slate-50 text-indigo-400">
                  <Calendar size={20} />
                </div>
              </div>
            </div>

            {/* Content Feed */}
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post._id || post.id} post={post} />
              ))
            ) : (
              <div className="bg-white rounded-[2rem] p-24 text-center border-2 border-dashed border-slate-100">
                <Sparkles size={64} className="text-slate-100 mx-auto mb-8" />
                <p className="text-slate-400 text-lg italic font-medium">
                  The community feed is waiting for your story.
                </p>
              </div>
            )}
          </main>

          {/* Activity Sidebar */}
          <aside className="lg:col-span-1 hidden lg:block space-y-8">
            <div className="sticky top-28">
              <div className="p-8 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Award size={120} />
                </div>
                <div className="relative z-10">
                  <h4 className="text-2xl font-black mb-4 font-outfit uppercase tracking-tight leading-none">
                    Ambassador Spotlight
                  </h4>
                  <p className="text-indigo-200/60 text-xs font-medium leading-relaxed italic">
                    "Mentoring graduates was the most rewarding phase of my
                    career."
                  </p>
                </div>
              </div>

              <div className="mt-8 p-8 bg-white rounded-[2rem] shadow-xl border border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">
                  Network Reach
                </h4>
                <div className="space-y-6">
                  {[
                    { label: "India", count: 840, color: "bg-indigo-500" },
                    { label: "USA", count: 210, color: "bg-blue-500" },
                  ].map((stat, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mb-2 text-slate-500">
                        <span>{stat.label}</span>
                        <span>{stat.count} Members</span>
                      </div>
                      <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${stat.color} rounded-full`}
                          style={{ width: i === 0 ? "80%" : "30%" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Send size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 font-outfit uppercase tracking-tight leading-none">
                        Global Feed
                      </h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        Visible to all alumni
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-rose-500 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleCreatePost} className="space-y-8">
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    required
                    placeholder="Share your professional milestone, career advice, or campus memories..."
                    className="w-full h-48 border-none focus:ring-0 text-xl font-medium placeholder:text-slate-300 resize-none italic"
                  />

                  <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                    <div className="flex gap-4 text-slate-400">
                      <button
                        type="button"
                        className="p-4 rounded-2xl hover:bg-slate-50 hover:text-indigo-600 transition-all"
                      >
                        <ImageIcon size={24} />
                      </button>
                      <button
                        type="button"
                        className="p-4 rounded-2xl hover:bg-slate-50 hover:text-indigo-600 transition-all"
                      >
                        <FileText size={24} />
                      </button>
                      <button
                        type="button"
                        className="p-4 rounded-2xl hover:bg-slate-50 hover:text-indigo-600 transition-all"
                      >
                        <Calendar size={24} />
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={!postContent.trim() || loading}
                      className="px-12 py-5 bg-slate-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-600 disabled:opacity-20 disabled:hover:bg-slate-950 transition-all shadow-xl shadow-slate-200"
                    >
                      {loading ? "Posting..." : "Post"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
