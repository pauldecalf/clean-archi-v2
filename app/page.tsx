"use client";

import { useState } from "react";

export default function Home() {
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        mail: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erreur lors de l'inscription");
            }

            setMessage({
                type: "success",
                text: `Inscription réussie ! Bienvenue ${data.name} ${data.lastname}`,
            });

            // Réinitialiser le formulaire
            setFormData({
                name: "",
                lastname: "",
                mail: "",
                password: "",
            });
        } catch (error: any) {
            setMessage({
                type: "error",
                text: error.message || "Une erreur est survenue",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-2xl flex-col items-center justify-center py-16 px-8">
                <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-black dark:text-zinc-50">Inscription</h1>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Créez votre compte pour commencer</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-black dark:text-zinc-300">
                                Prénom
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
                                placeholder="Votre prénom"
                            />
                        </div>

                        <div>
                            <label htmlFor="lastname" className="block text-sm font-medium text-black dark:text-zinc-300">
                                Nom
                            </label>
                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                required
                                value={formData.lastname}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
                                placeholder="Votre nom"
                            />
                        </div>

                        <div>
                            <label htmlFor="mail" className="block text-sm font-medium text-black dark:text-zinc-300">
                                Email
                            </label>
                            <input
                                type="email"
                                id="mail"
                                name="mail"
                                required
                                value={formData.mail}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
                                placeholder="votre@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-black dark:text-zinc-300">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
                                placeholder="Votre mot de passe"
                            />
                        </div>

                        {message && (
                            <div
                                className={`rounded-md p-3 text-sm ${
                                    message.type === "success"
                                        ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                        : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                }`}>
                                {message.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200">
                            {loading ? "Inscription en cours..." : "S'inscrire"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
