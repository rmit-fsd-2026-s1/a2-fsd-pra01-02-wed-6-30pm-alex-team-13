"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_VENUES,
  GET_VENDORS,
  CREATE_VENUE,
  UPDATE_VENUE,
  DELETE_VENUE,
  ASSIGN_VENDOR,
  SET_FEATURED,
} from "@/services/graphql";

const emptyForm = {
  name: "",
  Location: "",
  capacity: "",
  price: "",
  imageUrl: "",
  description: "",
  suitabilityKeywords: "",
  vendorId: "",
};

export default function DashboardPage() {
  const router = useRouter();

  const { data: venueData, refetch } = useQuery(GET_VENUES, { fetchPolicy: "network-only" });
  const { data: vendorData } = useQuery(GET_VENDORS);

  const [createVenue] = useMutation(CREATE_VENUE);
  const [updateVenue] = useMutation(UPDATE_VENUE);
  const [deleteVenue] = useMutation(DELETE_VENUE);
  const [assignVendor] = useMutation(ASSIGN_VENDOR);
  const [setFeatured] = useMutation(SET_FEATURED);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") !== "true") {
      router.push("/");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    router.push("/");
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.Location || !form.capacity || !form.price || !form.description) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      if (editingId) {
        await updateVenue({
          variables: {
            id: editingId,
            name: form.name,
            Location: form.Location,
            capacity: Number(form.capacity),
            price: Number(form.price),
            imageUrl: form.imageUrl,
            description: form.description,
            suitabilityKeywords: form.suitabilityKeywords,
          },
        });
      } else {
        await createVenue({
          variables: {
            name: form.name,
            Location: form.Location,
            capacity: Number(form.capacity),
            price: Number(form.price),
            imageUrl: form.imageUrl,
            description: form.description,
            suitabilityKeywords: form.suitabilityKeywords,
            vendorId: form.vendorId ? Number(form.vendorId) : null,
          },
        });
      }
      resetForm();
      refetch();
    } catch (err) {
      console.log(err);
      setError("Failed to save venue.");
    }
  };

  const startEdit = (venue: any) => {
    setEditingId(venue.id);
    setForm({
      name: venue.name,
      Location: venue.Location,
      capacity: String(venue.capacity),
      price: String(venue.price),
      imageUrl: venue.imageUrl,
      description: venue.description,
      suitabilityKeywords: venue.suitabilityKeywords,
      vendorId: venue.vendor ? String(venue.vendor.id) : "",
    });
  };

  const handleDelete = async (id: number) => {
    await deleteVenue({ variables: { id } });
    refetch();
  };

  const handleAssign = async (venueId: number, vendorId: string) => {
    if (!vendorId) return;
    await assignVendor({ variables: { venueId, vendorId: Number(vendorId) } });
    refetch();
  };

  const handleFeatured = async (venueId: number, featured: boolean) => {
    await setFeatured({ variables: { venueId, featured } });
    refetch();
  };

  const venues = venueData?.venues || [];
  const vendors = vendorData?.vendors || [];

  return (
    <main className="min-h-screen">
      <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-5">
          <Link href="/report" className="hover:text-blue-300">Reports</Link>
          <button onClick={handleLogout} className="text-sm font-bold cursor-pointer">LOGOUT</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            {editingId ? "Edit Venue" : "Add New Venue"}
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <input placeholder="Venue Name" className="p-3 border border-slate-300 rounded text-slate-800" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Location" className="p-3 border border-slate-300 rounded text-slate-800" value={form.Location} onChange={(e) => setForm({ ...form, Location: e.target.value })} />
            <input type="number" placeholder="Capacity" className="p-3 border border-slate-300 rounded text-slate-800" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
            <input type="number" placeholder="Price" className="p-3 border border-slate-300 rounded text-slate-800" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input placeholder="Image URL (e.g. /images/photo1.jpg)" className="p-3 border border-slate-300 rounded text-slate-800" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            <input placeholder="Suitability Keywords" className="p-3 border border-slate-300 rounded text-slate-800" value={form.suitabilityKeywords} onChange={(e) => setForm({ ...form, suitabilityKeywords: e.target.value })} />
            <textarea placeholder="Description" className="p-3 border border-slate-300 rounded text-slate-800 md:col-span-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            {!editingId && (
              <select className="p-3 border border-slate-300 rounded text-slate-800 md:col-span-2" value={form.vendorId} onChange={(e) => setForm({ ...form, vendorId: e.target.value })}>
                <option value="">No vendor assigned</option>
                {vendors.map((v: any) => (
                  <option key={v.id} value={v.id}>{v.firstName} {v.lastName} ({v.email})</option>
                ))}
              </select>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2 rounded cursor-pointer">
              {editingId ? "Update Venue" : "Add Venue"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="bg-slate-300 text-slate-800 font-bold px-6 py-2 rounded cursor-pointer">
                Cancel
              </button>
            )}
          </div>
        </form>

        <h2 className="text-lg font-bold text-slate-800 mb-4">All Venues</h2>
        <div className="space-y-4">
          {venues.map((venue: any) => (
            <div key={venue.id} className="bg-white p-5 rounded-xl shadow-sm">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-bold text-slate-900">
                    {venue.name}
                    {venue.featured && <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Featured</span>}
                  </h3>
                  <p className="text-sm text-slate-500">{venue.Location} - capacity {venue.capacity} - ${venue.price}</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Vendor: {venue.vendor ? `${venue.vendor.firstName} ${venue.vendor.lastName}` : "None"}
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(venue)} className="text-sm bg-blue-600 text-white px-3 py-1 rounded cursor-pointer">Edit</button>
                    <button onClick={() => handleDelete(venue.id)} className="text-sm bg-red-600 text-white px-3 py-1 rounded cursor-pointer">Delete</button>
                    <button onClick={() => handleFeatured(venue.id, !venue.featured)} className="text-sm bg-yellow-600 text-white px-3 py-1 rounded cursor-pointer">
                      {venue.featured ? "Unfeature" : "Feature"}
                    </button>
                  </div>
                  <select
                    defaultValue={venue.vendor ? String(venue.vendor.id) : ""}
                    onChange={(e) => handleAssign(venue.id, e.target.value)}
                    className="text-sm p-2 border border-slate-300 rounded text-slate-800"
                  >
                    <option value="">Assign vendor...</option>
                    {vendors.map((v: any) => (
                      <option key={v.id} value={v.id}>{v.firstName} {v.lastName}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
