import { create } from "zustand";

export const useProductStore = create((set) => ({
	products: [],
	setProducts: (products) => set({ products }),
	createProduct: async (newProduct) => {
		if (!newProduct.name || !newProduct.image || !newProduct.price) {
			return { success: false, message: "Please fill in all fields." };
		}
		const res = await fetch("/api/products", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newProduct),
		});
		const data = await res.json();
		set((state) => ({ products: [...state.products, data.data] }));
		return { success: true, message: "Product created successfully" };
	},
	fetchProducts: async () => {
		const res = await fetch("/api/products");
		const data = await res.json();
		set({ products: data.data });
	},
	  
	deleteProduct: async (prod_id) => {
		const res = await fetch(`/api/products/${prod_id}`, {
			method: "DELETE",
		});
		const data = await res.json();
		if( !data.success ) 
			return { success: false, message: data.message }

		// Remove the product from the store
		set ((state) => ({
			products: state.products.filter((product) => product._id !== prod_id)
		}));
		return { success: true, message: data.message };
	},
	updateProduct: async (prod_id, updatedProduct) => {
		const res = await fetch(`/api/products/${prod_id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedProduct),
		});
		const data = await res.json();
		if( !data.success ) 
			return { success: false, message: data.message }

		// Update the product in the store
		set((state) => ({
			products: state.products.map((product) => (
				product._id === prod_id ? data.data : product
			)),
		}));
		
		return { success: true, message: data.message };
	},
}))
