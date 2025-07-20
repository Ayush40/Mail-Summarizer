import SummaryList from '../SummaryList';
import Loader from '../Loader';

export default function HomePage({
    accessToken,
    loading,
    summaries,
    onLoginClick
}) {
    return (
        <div className="flex flex-col items-center min-h-[60vh] justify-center space-y-6">
            {!accessToken ? (
                <>
                    <img
                        src="/mail.png"
                        className="w-32 h-32 mx-auto mb-4 rounded-full shadow-lg"
                        alt="AI Mail"
                    />
                    <h2 className="text-3xl font-extrabold mb-2">
                        Welcome to <span className="text-blue-400">Gmail Summarizer</span>
                    </h2>
                    <p className="text-gray-300 max-w-xl mb-4">
                        Summarize your Gmail inbox quickly with the power of AI.<br />
                        Stay focused and save time each day!
                    </p>
                    <button
                        onClick={onLoginClick}
                        className="bg-gradient-to-r from-blue-600 to-blue-400 px-8 py-4 rounded-xl hover:from-blue-700 shadow-xl transition font-bold text-lg"
                    >
                        Login with Google
                    </button>
                </>
            ) : (
                <>
                    {loading && !summaries.length ? (
                        <Loader message="Summarizing today's emails..." />
                    ) : summaries.length > 0 ? (
                        <SummaryList summaries={summaries} />
                    ) : (
                        <p className="text-xl text-gray-300 mt-10">No emails found today.</p>
                    )}
                </>
            )}
        </div>
    );
}
