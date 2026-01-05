import { useState } from "react";

const FaqForm = ({ onChange }) => {
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);

  const addFaq = () => {
    setFaqs((prev) => {
      const updated = [...prev, { question: "", answer: "" }];
      onChange?.(updated);
      return updated;
    });
  };

  const removeFaq = (index) => {
    setFaqs((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      onChange?.(updated);
      return updated;
    });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;

    setFaqs((prev) => {
      const updated = prev.map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      );
      onChange?.(updated);
      return updated;
    });
  };

  return (
    <section className="bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-400">
            help_center
          </span>
          Frequently Asked Questions
        </h2>
        <button
          type="button"
          onClick={addFaq}
          className="text-primary text-sm font-bold hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[18px]">
            add_circle
          </span>
          Add FAQ
        </button>
      </div>

      <div className="p-6 space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="relative p-5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
          >
            <button
              type="button"
              onClick={() => removeFaq(index)}
              className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
            </button>

            <div className="space-y-4 pr-8">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Question
                </label>
                <input
                  name="question"
                  value={faq.question}
                  onChange={(e) => handleItemChange(index, e)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium focus:border-primary outline-none"
                  placeholder="e.g. How do I reset the device?"
                  type="text"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Answer
                </label>
                <textarea
                  name="answer"
                  value={faq.answer}
                  onChange={(e) => handleItemChange(index, e)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:border-primary outline-none resize-none"
                  placeholder="Provide a detailed answer..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}
        {faqs.length === 0 && (
          <div className="text-center py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
            <p className="text-xs text-slate-400">No FAQs added.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FaqForm;
