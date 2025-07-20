export default function Loader({ message = "Loading..." }) {
    return (
        <div className="flex flex-col items-center space-y-4 py-12">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg text-center">{message}</p>
        </div>
    );
}
