'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Button, Checkbox, TextInput, Textarea } from 'flowbite-react';

interface Todo {
    _id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
}

export default function Todolist() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState<string>('');
    const [newDescription, setNewDescription] = useState<string>('');
    const [isAdding, setIsAdding] = useState<boolean>(false);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get('/api/todos', {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            setTodos(response.data);
        } catch (error) {
            toast.error('Failed to fetch todos');
            console.error('Error fetching todos:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.trim()) return;

        setIsAdding(true);
        try {
            const response = await axios.post(
                '/api/todos',
                { title: newTodo, description: newDescription },
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                }
            );
            setTodos([...todos, response.data]);
            setNewTodo('');
            setNewDescription('');
            toast.success('Todo added successfully!');
        } catch (error) {
            toast.error('Failed to add todo');
            console.error('Error adding todo:', error);
        } finally {
            setIsAdding(false);
        }
    };

    const toggleComplete = async (id: string) => {
        try {
            const todo = todos.find((t) => t._id === id);
            const response = await axios.patch(
                `/api/todos/${id}`,
                { completed: !todo?.completed },
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                }
            );
            setTodos(todos.map((t) => (t._id === id ? response.data : t)));
            toast.success('Todo updated successfully!');
        } catch (error) {
            toast.error('Failed to update todo');
            console.error('Error updating todo:', error);
        }
    };

    const deleteTodo = async (id: string) => {
        try {
            await axios.delete(`/api/todos/${id}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            });
            setTodos(todos.filter((t) => t._id !== id));
            toast.success('Todo deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete todo');
            console.error('Error deleting todo:', error);
        }
    };

    return (
        <section className='min-h-screen py-32'>
            <div className="container px-4">
                <h1 className="text-3xl font-bold mb-8">Todo List</h1>
                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="flex flex-col gap-2">
                        <TextInput
                            type="text"
                            value={newTodo}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTodo(e.target.value)}
                            placeholder="Add a new todo..."
                            className="flex-1"
                            required
                        />
                        <Textarea
                            value={newDescription}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewDescription(e.target.value)}
                            placeholder="Add description..."
                            className="flex-1"
                            rows={3}
                        />
                        <Button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            disabled={isAdding}
                        >
                            {isAdding ? 'Adding...' : 'Add'}
                        </Button>
                    </div>
                </form>
                <ul className="space-y-4">
                    {todos.map((todo) => (
                        <li
                            key={todo._id}
                            className="flex flex-col p-4 border rounded"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-4">
                                    <Checkbox
                                        checked={todo.completed}
                                        onChange={() => toggleComplete(todo._id)}
                                    />
                                    <span
                                        className={`${todo.completed ? 'line-through text-gray-500' : ''
                                            }`}
                                    >
                                        {todo.title}
                                    </span>
                                </div>
                                <Button
                                    onClick={() => deleteTodo(todo._id)}
                                    color="failure"
                                    size="sm"
                                >
                                    Delete
                                </Button>
                            </div>
                            {todo.description && (
                                <p className="text-gray-600 ml-8">{todo.description}</p>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
