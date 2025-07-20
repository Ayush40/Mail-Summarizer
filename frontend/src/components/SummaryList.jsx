import { motion } from 'framer-motion';

export default function SummaryList({ summaries }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {summaries.map((entry, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white text-gray-900 p-5 rounded-xl shadow"
                >
                    <h2 className="text-lg font-bold text-blue-700 mb-2">
                        {entry.sender}
                    </h2>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        {entry.points.map((point, i) => (
                            <li key={i}>{point}</li>
                        ))}
                    </ul>
                </motion.div>
            ))}
        </div>
    );
}
