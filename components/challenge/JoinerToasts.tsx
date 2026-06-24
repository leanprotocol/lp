"use client";

import { useEffect, useState } from "react";

const PEOPLE: [string, string][] = [
  ["Priya", "Delhi"],
  ["Arjun", "Mumbai"],
  ["Sneha", "Bengaluru"],
  ["Rohit", "Pune"],
  ["Ananya", "Hyderabad"],
  ["Kabir", "Jaipur"],
  ["Meera", "Kolkata"],
  ["Vikram", "Chennai"],
  ["Neha", "Lucknow"],
  ["Aditya", "Surat"],
];

const ACTIONS = ["joined the 30-day challenge", "started the challenge", "requested a callback", "claimed a reward"];

export function JoinerToasts() {
  const [toast, setToast] = useState<{ name: string; city: string; action: string } | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    function fireToast() {
      const [name, city] = PEOPLE[Math.floor(Math.random() * PEOPLE.length)];
      const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
      setToast({ name, city, action });
      setShow(true);
      setTimeout(() => setShow(false), 5000);
    }

    const initialDelay = setTimeout(() => {
      fireToast();
      const interval = setInterval(fireToast, 13000);
      return () => clearInterval(interval);
    }, 6000);

    return () => clearTimeout(initialDelay);
  }, []);

  if (!toast) return null;

  return (
    <div className={`joiner ${show ? "show" : ""}`}>
      <b>{toast.name}</b> from {toast.city} just {toast.action}
      <small>a few minutes ago</small>
    </div>
  );
}
