import { Send, Sparkles, Upload } from "lucide-react";
import OpenAI from "openai";
import { useState } from "react";

const LinkedInPostForm = () => {
    const [formData, setFormData] = useState({
        profileType: [],
        postType: "text",
        topic: "",
        content: "",
        originalUrl: "",
        title: "",
        videoUrl: "",
        thumbnailImage: null,
        thumbnailUrl: "",
    });

    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");

    const handleCheckboxChange = (value) => {
        setFormData((prev) => {
            const updated = prev.profileType.includes(value)
                ? prev.profileType.filter((v) => v !== value)
                : [...prev.profileType, value];
            return { ...prev, profileType: updated };
        });
        setError("");
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFormData((p) => ({ ...p, thumbnailImage: file, thumbnailUrl: "" }));
        setPreview(URL.createObjectURL(file));
    };

    const deleteImage = () => {
        setFormData((p) => ({ ...p, thumbnailImage: null }));
        setPreview(null);
    };

    const client = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY, // অথবা process.env.OPENAI_API_KEY (যদি Node হয়)
        dangerouslyAllowBrowser: true, // শুধুমাত্র client-side dev এর জন্য
    });

    const generateContent = async () => {
        if (!formData.topic) return;
        setLoading(true);
        try {
            const prompt = `Write a professional yet engaging LinkedIn post about "${formData.topic}". 
            Role:
            
            *Create an attractive *LinkedIn post* about *AI-related topics* (for example: n8n workflows, Make automations, AI voice agents, GPT tools, etc.).

*Instructions:*
- Start with a *one-line, eye-catching headline* related to the topic.  
- Write a *medium-length post* (about 100–150 words) that sounds engaging, insightful, and professional — suitable for a LinkedIn audience interested in AI and automation.  
- End with *a few relevant hashtags* to boost visibility and reach.  

*Example Input:*  
"How AI voice agents are transforming customer support"

*Example Output:*  
*Headline:* AI Voice Agents: The Future of Effortless Customer Support  
*Post:* The days of waiting endlessly on hold are numbered. AI voice agents are revolutionizing how businesses interact with customers — providing instant, accurate, and human-like responses 24/7. By integrating these intelligent systems into workflows, companies can save costs, scale faster, and deliver a superior user experience. The real advantage? Combining automation tools like Make or n8n with AI voice tech creates an ecosystem that learns and improves over time — a true game-changer for modern businesses.  
*Tags:* #AI #VoiceAgents #Automation #n8n #Make #ArtificialIntelligence #Innovation
            `;

            const res = await client.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.8,
                max_tokens: 200,
            });

            const content =
                res.choices?.[0]?.message?.content?.trim() ||
                "✨ Couldn’t generate content, please try again.";
            setFormData((p) => ({ ...p, content }));
        } catch (err) {
            console.error("OpenAI Error:", err);
            setFormData((p) => ({
                ...p,
                content: "⚠️ Error generating content. Try again later.",
            }));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.profileType.length === 0) {
            setError("Please select at least one profile type.");
            return;
        }

        const webhook =
            "https://server3.automationlearners.pro/webhook/18ff0b4d-0480-4d8f-acfc-4a9b43cf9281";

        const payload = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) payload.append(key, value);
        });

        try {
            const res = await fetch(webhook, { method: "POST", body: payload });
            res.ok
                ? alert("✅ Post submitted successfully!")
                : alert("❌ Failed to submit post!");
        } catch {
            alert("⚠️ Network error!");
        }
    };

    const isThumbnailInvalid =
        formData.thumbnailImage && formData.thumbnailUrl.length > 0;

    // Thumbnail Section Reusable
    const ThumbnailUploader = ({ article = false }) => (
        <div>
            <label className="block text-gray-700 font-medium mb-2">
                Thumbnail (optional)
            </label>
            <div className="space-y-3">
                {!preview && (
                    <div className="flex gap-3">
                        {
                            article && (<label className="flex-1 border rounded-md px-3 py-2 text-center cursor-pointer text-indigo-600 font-medium bg-indigo-50 hover:bg-indigo-100 transition">
                                <div className="flex items-center justify-center gap-2">
                                    <Upload /> Upload Image
                                    <input
                                        type="file"
                                        onChange={handleImageUpload}
                                        disabled={!!formData.thumbnailUrl}
                                        className="hidden"
                                    />
                                </div>
                            </label>)
                        }

                        <input
                            type="url"
                            placeholder="Or image URL"
                            value={formData.thumbnailUrl}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    thumbnailUrl: e.target.value,
                                    thumbnailImage: null,
                                })
                            }
                            disabled={!!formData.thumbnailImage}
                            className="flex-1 border rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-indigo-400"
                        />


                    </div>
                )}
                {preview && (
                    <div className="relative w-40 mt-3">
                        <img
                            src={preview}
                            className="w-40 h-40 object-cover rounded-lg shadow-md"
                        />
                        <button
                            type="button"
                            onClick={deleteImage}
                            className="absolute top-2 cursor-pointer right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md hover:bg-red-600"
                        >
                            ✕
                        </button>
                    </div>
                )}
                {isThumbnailInvalid && (
                    <p className="text-sm text-red-500">
                        ⚠️ You can’t use both file and URL together.
                    </p>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 w-full via-white to-indigo-100 p-6">
            <form
                onSubmit={handleSubmit}
                className="backdrop-blur-md bg-white/70 border border-white/30 shadow-2xl rounded-3xl w-2xl p-8 space-y-4"
            >
                <h1 className="text-5xl font-bold text-center text-indigo-700 mb-10">
                    ✨ LinkedIn Post Form
                </h1>

                {/* Profile Type */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Profile Type <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-6">
                        {["Personal Profile", "LinkedIn Page"].map((type) => (
                            <label
                                key={type}
                                className={`flex items-center gap-2 px-3 py-2 border rounded-xl cursor-pointer transition ${formData.profileType.includes(type)
                                    ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
                                    : "border-gray-300 hover:bg-gray-100"
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={formData.profileType.includes(type)}
                                    onChange={() => handleCheckboxChange(type)}
                                    className="hidden"
                                />
                                {type}
                            </label>
                        ))}
                    </div>
                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                </div>

                {/* Post Type */}
                <div className="max-w-full">
                    <label className="block text-gray-700 font-medium mb-2">
                        Post Type
                    </label>
                    <select
                        value={formData.postType}
                        onChange={(e) =>
                            setFormData({ ...formData, postType: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400"
                    >
                        <option value="text">Text</option>
                        <option value="article">Article</option>
                        {/* <option value="video">Video</option> */}
                    </select>
                </div>

                {/* Fixed height wrapper so layout doesn’t jump */}
                <div className=" flex flex-col justify-start gap-2 transition-all duration-300">
                    {formData.postType === "text" && (
                        <>
                            <label className="block text-gray-700 font-medium">
                                Post Topic
                            </label>
                            <input
                                type="text"
                                placeholder="Write your topic..."
                                value={formData.topic}
                                onChange={(e) =>
                                    setFormData({ ...formData, topic: e.target.value })
                                }
                                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400"
                            />
                            <label className="block text-gray-700 font-medium">
                                Post Content
                            </label>
                            <textarea
                                placeholder="Write or generate your LinkedIn post..."
                                value={formData.content}
                                onChange={(e) =>
                                    setFormData({ ...formData, content: e.target.value })
                                }
                                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 h-32"
                            />
                            <button
                                type="button"
                                onClick={generateContent}
                                disabled={!formData.topic || loading}
                                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer text-white font-medium transition ${formData.topic
                                    ? "bg-gradient-to-r from-indigo-500 to-blue-500 hover:opacity-90"
                                    : "bg-gray-300 cursor-not-allowed"
                                    }`}
                            >
                                <Sparkles className="w-4 h-4" />
                                {loading ? "Generating..." : "Generate Content ✨"}
                            </button>

                            <ThumbnailUploader article={true} />
                        </>
                    )}

                    {formData.postType === "article" && (
                        <>
                            <label className="block text-gray-700 font-medium">
                                Post Content
                            </label>
                            <textarea
                                placeholder="Write your article summary..."
                                value={formData.content}
                                onChange={(e) =>
                                    setFormData({ ...formData, content: e.target.value })
                                }
                                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 h-32"
                            ></textarea>
                            <label className="block text-gray-700 font-medium">
                                Original Article URL
                            </label>
                            <input
                                type="url"
                                placeholder="Original article URL"
                                value={formData.originalUrl}
                                onChange={(e) =>
                                    setFormData({ ...formData, originalUrl: e.target.value })
                                }
                                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400"
                            />
                            <label className="block text-gray-700 font-medium">
                                Link Title
                            </label>
                            <input
                                type="text"
                                placeholder="Title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400"
                            />

                            {/* ✅ Thumbnail added for Article */}
                            <ThumbnailUploader article={false} />
                        </>
                    )}

                    {formData.postType === "video" && (
                        <>
                            <label className="block text-gray-700 font-medium">
                                Post Topic
                            </label>
                            <input
                                type="text"
                                placeholder="Write your topic..."
                                value={formData.topic}
                                onChange={(e) =>
                                    setFormData({ ...formData, topic: e.target.value })
                                }
                                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400"
                            />
                            <label className="block text-gray-700 font-medium">
                                Post Content
                            </label>
                            <textarea
                                placeholder="Write or generate video content..."
                                value={formData.content}
                                onChange={(e) =>
                                    setFormData({ ...formData, content: e.target.value })
                                }
                                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 h-32"
                            />
                            <button
                                type="button"
                                onClick={generateContent}
                                disabled={!formData.topic || loading}
                                className={`w-full flex items-center justify-center gap-2 py-3 cursor-pointer rounded-xl text-white font-medium transition ${formData.topic
                                    ? "bg-gradient-to-r from-indigo-500 to-blue-500 hover:opacity-90"
                                    : "bg-gray-300 cursor-not-allowed"
                                    }`}
                            >
                                <Sparkles className="w-4 h-4" />
                                {loading ? "Generating..." : "Generate Content ✨"}
                            </button>
                            <label className="block text-gray-700 font-medium">
                                Video URL
                            </label>
                            <input
                                type="url"
                                placeholder="Video URL"
                                value={formData.videoUrl}
                                onChange={(e) =>
                                    setFormData({ ...formData, videoUrl: e.target.value })
                                }
                                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400"
                            />
                        </>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-white cursor-pointer bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 shadow-md hover:shadow-lg hover:opacity-90 transition"
                >
                    <Send className="w-5 h-5" /> Submit Post 🚀
                </button>
            </form>
        </div>
    );
};

export default LinkedInPostForm;