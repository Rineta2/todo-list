'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Button, Checkbox, TextInput } from 'flowbite-react';

interface Todo {
    _id: string;
    text: string;
    completed: boolean;
    createdAt: string;
}

export default function Todolist() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState('');

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

        try {
            const response = await axios.post(
                '/api/todos',
                { text: newTodo },
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                }
            );
            setTodos([...todos, response.data]);
            setNewTodo('');
            toast.success('Todo added successfully!');
        } catch (error) {
            toast.error('Failed to add todo');
            console.error('Error adding todo:', error);
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
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8">Todo List</h1>
            <form onSubmit={handleSubmit} className="mb-8">
                <div className="flex gap-2">
                    <TextInput
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="Add a new todo..."
                        className="flex-1"
                    />
                    <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Add
                    </Button>
                </div>
            </form>
            <ul className="space-y-4">
                {todos.map((todo) => (
                    <li
                        key={todo._id}
                        className="flex items-center justify-between p-4 border rounded"
                    >
                        <div className="flex items-center gap-4">
                            <Checkbox
                                checked={todo.completed}
                                onChange={() => toggleComplete(todo._id)}
                            />
                            <span
                                className={`${todo.completed ? 'line-through text-gray-500' : ''
                                    }`}
                            >
                                {todo.text}
                            </span>
                        </div>
                        <Button
                            onClick={() => deleteTodo(todo._id)}
                            color="failure"
                            size="sm"
                        >
                            Delete
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
