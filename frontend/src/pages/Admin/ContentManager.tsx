
import React, { useEffect, useState } from "react";
import {
	adminFetchContent,
	adminCreateContent,
	adminUpdateContent,
	adminDeleteContent
} from "../../services/api";

interface Article {
	_id: string;
	title: string;
	content: string;
	createdAt: string;
}

const ContentManager: React.FC = () => {
	const [articles, setArticles] = useState<Article[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [editArticle, setEditArticle] = useState<Article | null>(null);
	const [form, setForm] = useState({ title: "", content: "" });

	useEffect(() => {
		fetchContent();
	}, []);

	const fetchContent = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await adminFetchContent();
			setArticles(res.data);
		} catch (err: any) {
			setError("Error al cargar artículos");
		} finally {
			setLoading(false);
		}
	};

	const handleOpenModal = (article?: Article) => {
		setEditArticle(article || null);
		setForm(article ? { title: article.title, content: article.content } : { title: "", content: "" });
		setModalOpen(true);
	};

	const handleCloseModal = () => {
		setModalOpen(false);
		setEditArticle(null);
		setForm({ title: "", content: "" });
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			if (editArticle) {
				await adminUpdateContent(editArticle._id, form);
			} else {
				await adminCreateContent(form);
			}
			fetchContent();
			handleCloseModal();
		} catch (err: any) {
			setError("Error al guardar el artículo");
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		setLoading(true);
		setError(null);
		try {
			await adminDeleteContent(id);
			fetchContent();
		} catch (err: any) {
			setError("Error al eliminar el artículo");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-6">
			<h2 className="text-2xl font-bold mb-4">Gestión de Contenido</h2>
			<button className="bg-blue-600 text-white px-4 py-2 rounded mb-4" onClick={() => handleOpenModal()}>
				Nuevo Artículo
			</button>
			{loading && <p>Cargando...</p>}
			{error && <p className="text-red-500">{error}</p>}
			<ul className="space-y-4">
				{articles.map((article) => (
					<li key={article._id} className="border p-4 rounded shadow">
						<h3 className="font-semibold text-lg">{article.title}</h3>
						<p>{article.content}</p>
						<div className="mt-2 flex gap-2">
							<button className="bg-yellow-500 text-white px-2 py-1 rounded" onClick={() => handleOpenModal(article)}>
								Editar
							</button>
							<button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(article._id)}>
								Eliminar
							</button>
						</div>
					</li>
				))}
			</ul>

			{modalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded shadow w-full max-w-md">
						<h3 className="text-xl font-bold mb-4">{editArticle ? "Editar Artículo" : "Nuevo Artículo"}</h3>
						<form onSubmit={handleSubmit} className="space-y-4">
							<input
								type="text"
								name="title"
								value={form.title}
								onChange={handleChange}
								placeholder="Título"
								className="w-full border px-3 py-2 rounded"
								required
							/>
							<textarea
								name="content"
								value={form.content}
								onChange={handleChange}
								placeholder="Contenido"
								className="w-full border px-3 py-2 rounded"
								required
							/>
							<div className="flex gap-2 justify-end">
								<button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={handleCloseModal}>
									Cancelar
								</button>
								<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
									Guardar
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default ContentManager;


