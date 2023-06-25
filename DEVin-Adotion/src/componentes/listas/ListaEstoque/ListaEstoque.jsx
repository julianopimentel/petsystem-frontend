import { useState, useEffect } from "react";
import { useFetch } from "../../../hooks/useFetch";

export default function ListaEstoque() {
    const { itens: produtos, deleteData, updateData } = useFetch(
        "http://localhost:8080/estoque"
    );

    const [editingItemId, setEditingItemId] = useState(null);
    const [produtosList, setProdutosList] = useState([]);

    useEffect(() => {
        setProdutosList(produtos);
    }, [produtos]);

    function handleDelete(id) {
        setProdutosList((prevProdutos) =>
            prevProdutos.filter((item) => item.id !== id)
        );
        deleteData(id);
    }

    function handleEdit(id) {
        setEditingItemId(id);
    }

    function handleSave(id) {
        const produtoElement = document.getElementById(`produto-${id}`);
        const quantidadeElement = document.getElementById(`quantidade-${id}`);
        const produto = produtosList.find((item) => item.id === id);

        const updatedProduto = {
            ...produto,
            produto: produtoElement.value,
            quantidade: quantidadeElement.value,
        };

        updateData(id, updatedProduto)
            .then(() => {
                setEditingItemId(null);
                setProdutosList((prevProdutos) =>
                    prevProdutos.map((item) =>
                        item.id === id ? { ...item, ...updatedProduto } : item
                    )
                );
            })
            .catch((error) => {
                console.error("Erro ao atualizar o item:", error);
            });
    }

    return (
        <div className="container">
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Armazém</th>
                        <th>Produto</th>
                        <th>Categoria</th>
                        <th>Quantidade</th>
                        <th> </th>
                    </tr>
                </thead>
                <tbody>
                    {produtosList ? (
                        produtosList.map((item) => {
                            const { nome } = item.armazem || {};
                            const isEditing = item.id === editingItemId;

                            return (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{nome}</td>
                                    <td>
                                        {isEditing ? (
                                            <select
                                                id={`produto-${item.id}`}
                                                defaultValue={item.produto}
                                            >
                                                <option value="racao">Ração</option>
                                                <option value="antiparasitario">Antiparasitário</option>
                                                <option value="antipulgas">Antipulgas</option>
                                            </select>
                                        ) : (
                                            <td>{item.produto}</td>
                                        )}
                                    </td>
                                    <td>{item.categoria}</td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                id={`quantidade-${item.id}`}
                                                defaultValue={item.quantidade}
                                                min={0}
                                            />
                                        ) : (
                                            item.quantidade
                                        )}
                                    </td>

                                    <td>
                                        {isEditing ? (
                                            <button
                                                type="button"
                                                onClick={() => handleSave(item.id)}
                                            >
                                                Salvar
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(item.id)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    Remover
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <p>nenhum produto cadastrado ainda</p>
                    )}
                </tbody>
            </table>
        </div>
    );
}
