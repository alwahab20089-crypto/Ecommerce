import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { useContactFormMutation } from "../hooks/useContact";

// Edit these to your actual store details
const STORE_ADDRESS = "Street no 1 Chak # 7NB, Bhalwal,Sargodha";
const STORE_PHONE = "03341747392";
const STORE_EMAIL = "alwahab20089@gmail.com";
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(STORE_ADDRESS)}&output=embed`;

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const mutation = useContactFormMutation();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setStatus("");

    mutation.mutate(form, {
      onSuccess: (data) => {
        setStatus(data.message);
        setForm({ name: "", email: "", subject: "", message: "" });
      },
      onError: (err) => setError(err.response?.data?.message || "Could not send your message. Please try again."),
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-extrabold mb-2 tracking-wide">Contact Us</h1>
      <p className="text-gray-500 mb-10">Have a question? Send us a message and we'll get back to you within 48 hours.</p>

      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          {status && <p className="text-green-600 mb-4 text-sm">{status}</p>}
          {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input type="text" name="name" placeholder="Your name" value={form.name} onChange={handleChange} required className="border rounded-lg px-4 py-3" />
              <input type="email" name="email" placeholder="Your email" value={form.email} onChange={handleChange} required className="border rounded-lg px-4 py-3" />
            </div>
            <input type="text" name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} required className="w-full border rounded-lg px-4 py-3" />
            <textarea name="message" placeholder="Your message" value={form.message} onChange={handleChange} required rows={6} className="w-full border rounded-lg px-4 py-3" />
            <button type="submit" disabled={mutation.isPending} className="bg-black text-white px-8 py-3 rounded-full hover:bg-yellow-500 hover:text-black transition disabled:opacity-40">
              {mutation.isPending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="text-yellow-500 mt-1" size={20} />
              <p className="text-gray-700">{STORE_ADDRESS}</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-yellow-500" size={20} />
              <p className="text-gray-700">{STORE_PHONE}</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-yellow-500" size={20} />
              <p className="text-gray-700">{STORE_EMAIL}</p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-gray-200">
            <iframe
              title="Store Location"
              src={MAP_EMBED_SRC}
              width="100%"
              height="320"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;