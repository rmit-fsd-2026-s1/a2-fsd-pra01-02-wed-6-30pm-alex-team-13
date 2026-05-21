import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SignUp(){
    return(
        <>
            <Header/>
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-10">
                <h2 className="text-3xl font-bold text-slate-900">Sign Up</h2>
                <p className="mt-4 text-slate-700">Will be implemented in Assignment 2</p>
            </main>

            <Footer />
        </>
    );
}