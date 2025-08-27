import { useState } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import { FiDownload } from "react-icons/fi";
import { AiFillFilePdf } from "react-icons/ai";

export default function SummaryList({ summaries }) {
    const [exporting, setExporting] = useState(false);

    const sortedSummaries = [...summaries].sort((a, b) => {
        const order = { High: 0, Medium: 1, Low: 2 };
        return order[a.priority] - order[b.priority];
    });

    const exportToCSV = () => {
        const csvRows = [];
        csvRows.push(['Sender', 'Category', 'Priority', 'Summary Points'].join(','));

        for (const entry of sortedSummaries) {
            const points = entry.points.map(p => `"${p.replace(/"/g, '""')}"`).join('; ');
            csvRows.push(`"${entry.sender}","${entry.category}","${entry.priority}","${points}"`);
        }

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'email_summaries.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const exportToPDF = () => {
        setExporting(true);
        const doc = new jsPDF();
        let yOffset = 10;
        doc.setFontSize(16);
        doc.text('Email Summaries', 10, yOffset);
        yOffset += 10;

        sortedSummaries.forEach((entry, idx) => {
            doc.setFontSize(14);
            doc.setTextColor('#0055aa');
            doc.text(`${entry.sender}`, 10, yOffset);
            yOffset += 6;

            doc.setFontSize(12);
            doc.setTextColor('#444444');
            doc.text(`Category: ${entry.category}`, 10, yOffset);
            yOffset += 6;
            doc.text(`Priority: ${entry.priority}`, 10, yOffset);
            yOffset += 6;

            doc.setFontSize(11);
            entry.points.forEach(point => {
                const lines = doc.splitTextToSize(`• ${point}`, 180);
                if (yOffset + lines.length * 6 > 280) {
                    doc.addPage();
                    yOffset = 10;
                }
                doc.text(lines, 15, yOffset);
                yOffset += lines.length * 6;
            });

            yOffset += 10;
            if (yOffset > 280 && idx < sortedSummaries.length - 1) {
                doc.addPage();
                yOffset = 10;
            }
        });

        doc.save('email_summaries.pdf');
        setExporting(false);
    };

    return (
        <div>
            {sortedSummaries.length === 0 ? (
                <div className="text-center mt-20">
                    <p className="text-gray-400 text-lg">No emails to summarize for today.</p>
                </div>
            ) : (
                <>
                    <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
                        <button onClick={exportToCSV} className="flex items-center gap-2 px-6 py-3 bg-[#232946] text-[#eebbc3] rounded-full shadow-xl border border-[#eebbc3] hover:bg-[#1a1a2e] transition-all font-bold">
                            <FiDownload size={20} /> Export as CSV
                        </button>
                        <button onClick={exportToPDF} disabled={exporting} className="flex items-center gap-2 px-6 py-3 bg-[#232946] text-[#eebbc3] rounded-full shadow-xl border border-[#eebbc3] hover:bg-[#1a1a2e] transition-all font-bold disabled:opacity-50">
                            <AiFillFilePdf size={22} /> {exporting ? 'Generating PDF...' : 'Export as PDF'}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {sortedSummaries.map((entry, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white text-gray-900 p-5 rounded-xl shadow"
                            >
                                <h2 className="text-lg font-bold text-blue-700 mb-2">{entry.sender}</h2>
                                <div className="flex items-center text-xs text-gray-500 mb-2 space-x-2">
                                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700">{entry.category}</span>
                                    <span className={`px-2 py-0.5 rounded ${entry.priority === 'High'
                                        ? 'bg-red-100 text-red-700'
                                        : entry.priority === 'Medium'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-green-100 text-green-700'
                                        }`}>
                                        {entry.priority}
                                    </span>
                                </div>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    {entry.points.map((point, i) => (<li key={i}>{point}</li>))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
