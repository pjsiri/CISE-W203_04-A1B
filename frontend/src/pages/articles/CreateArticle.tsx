import React, { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import formStyles from "../../styles/Form.module.scss";
import { Article, DefaultEmptyArticle } from "@/components/Article";

const CreateArticle = () => {
    const router = useRouter();
    const [article, setArticle] = useState<Article>(DefaultEmptyArticle);

    // Update the article state on input change
    const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setArticle({ ...article, [event.target.name]: event.target.value });
    };

    const submitNewArticle = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(article),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            console.log(await response.json());
            setArticle(DefaultEmptyArticle); // Reset the form after submission
            router.push("/"); // Navigate back to article list
        } catch (err) {
            console.error("Error from CreateArticle:", err);
        }
    };

    return (
        <div className="container">
            <h1>New Article</h1>
            <h3>Fields marked * are required</h3>
            <form className={formStyles.form} onSubmit={submitNewArticle}>
                <label htmlFor="title">* Title:</label>
                <input
                    className={formStyles.formItem}
                    type="text"
                    name="title"
                    id="title"
                    value={article.title}
                    onChange={onChange}
                />

                <label htmlFor="authors">* Authors:</label>
                <input
                    className={formStyles.formItem}
                    type="text"
                    name="authors"
                    id="authors"
                    value={article.authors} // Now a single string
                    onChange={onChange} // Use the same onChange function
                    placeholder="Enter authors separated by commas"
                />

                <label htmlFor="source">* Source:</label>
                <input
                    className={formStyles.formItem}
                    type="text"
                    name="source"
                    id="source"
                    value={article.source}
                    onChange={onChange}
                />

                <label htmlFor="pubYear">* Publication Year:</label>
                <input
                    className={formStyles.formItem}
                    type="number"
                    name="pubYear"
                    id="pubYear"
                    value={article.pubYear}
                    onChange={onChange}
                />

                <label htmlFor="volume">Volume:</label>
                <input
                    className={formStyles.formItem}
                    type="text"
                    name="volume"
                    id="volume"
                    value={article.volume}
                    onChange={onChange}
                />

                <label htmlFor="number">Number:</label>
                <input
                    className={formStyles.formItem}
                    type="text"
                    name="number"
                    id="number"
                    value={article.number}
                    onChange={onChange}
                />

                <label htmlFor="pages">Pages:</label>
                <input
                    className={formStyles.formItem}
                    type="text"
                    name="pages"
                    id="pages"
                    value={article.pages}
                    onChange={onChange}
                />

                <label htmlFor="doi">DOI:</label>
                <input
                    className={formStyles.formItem}
                    type="text"
                    name="doi"
                    id="doi"
                    value={article.doi}
                    onChange={onChange}
                />

                <button className={formStyles.formItem} type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default CreateArticle;
