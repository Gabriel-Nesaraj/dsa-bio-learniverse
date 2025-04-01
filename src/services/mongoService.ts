
import { toast } from 'sonner';

// MongoDB service for interacting with our backend API
// In a real application, this would make calls to a backend API 
// that connects to MongoDB
export class MongoService {
  private apiUrl: string;
  
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  }
  
  // Helper method to handle API requests
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const url = `${this.apiUrl}/${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error(`API request failed: ${error}`);
      
      // Fallback to localStorage if API is unavailable
      console.log("Falling back to localStorage");
      return this.localStorageFallback<T>(endpoint, options);
    }
  }
  
  // Fallback to use localStorage when API is unavailable
  private localStorageFallback<T>(endpoint: string, options: RequestInit = {}): T {
    console.log("Using localStorage fallback for:", endpoint);
    toast.info("Using local data (MongoDB not available)", {
      id: "mongodb-fallback",
    });
    
    // Extract collection name from endpoint (e.g., 'problems' from 'problems')
    const collection = endpoint.split('/')[0];
    
    if (options.method === 'GET' || !options.method) {
      // GET request
      const data = localStorage.getItem(collection);
      return data ? JSON.parse(data) : [];
    } else if (options.method === 'POST' && options.body) {
      // POST request - Add new item
      const data = localStorage.getItem(collection);
      const items = data ? JSON.parse(data) : [];
      const newItem = JSON.parse(options.body.toString());
      
      if (!newItem.id) {
        newItem.id = Date.now(); // Add id if not present
      }
      
      items.push(newItem);
      localStorage.setItem(collection, JSON.stringify(items));
      return newItem as T;
    } else if (options.method === 'PUT' && options.body) {
      // PUT request - Update item
      const idMatch = endpoint.match(/\/(\w+)$/);
      if (idMatch) {
        const id = idMatch[1];
        const data = localStorage.getItem(collection);
        const items = data ? JSON.parse(data) : [];
        const updatedItem = JSON.parse(options.body.toString());
        
        const updatedItems = items.map((item: any) => 
          item.id.toString() === id ? updatedItem : item
        );
        
        localStorage.setItem(collection, JSON.stringify(updatedItems));
        return updatedItem as T;
      }
    } else if (options.method === 'DELETE') {
      // DELETE request
      const idMatch = endpoint.match(/\/(\w+)$/);
      if (idMatch) {
        const id = idMatch[1];
        const data = localStorage.getItem(collection);
        const items = data ? JSON.parse(data) : [];
        
        const updatedItems = items.filter((item: any) => 
          item.id.toString() !== id
        );
        
        localStorage.setItem(collection, JSON.stringify(updatedItems));
      }
    }
    
    return {} as T;
  }
  
  // Problems
  async getProblems() {
    return this.request<any[]>('problems');
  }
  
  async getProblemBySlug(slug: string) {
    return this.request<any>(`problems/slug/${slug}`);
  }
  
  async createProblem(problem: any) {
    return this.request<any>('problems', {
      method: 'POST',
      body: JSON.stringify(problem),
    });
  }
  
  async updateProblem(id: number, problem: any) {
    return this.request<any>(`problems/${id}`, {
      method: 'PUT',
      body: JSON.stringify(problem),
    });
  }
  
  async deleteProblem(id: number) {
    return this.request<void>(`problems/${id}`, {
      method: 'DELETE',
    });
  }
  
  // Submissions
  async getSubmissions() {
    return this.request<any[]>('submissions');
  }
  
  async createSubmission(submission: any) {
    return this.request<any>('submissions', {
      method: 'POST',
      body: JSON.stringify(submission),
    });
  }
  
  // Users
  async getUsers() {
    return this.request<any[]>('users');
  }
  
  async getUserById(id: string) {
    return this.request<any>(`users/${id}`);
  }
}

// Create a singleton instance
const mongoService = new MongoService();
export default mongoService;
