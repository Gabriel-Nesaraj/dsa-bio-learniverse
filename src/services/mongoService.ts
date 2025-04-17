
import { toast } from 'sonner';

// MongoDB service for interacting with our backend API
// In a real application, this would make calls to a backend API 
// that connects to MongoDB
export class MongoService {
  private apiUrl: string;
  private useFallback: boolean = false;
  
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    
    // Check if we should use fallback immediately
    this.checkApiAvailability();
  }
  
  // Check if the API is available
  private async checkApiAvailability(): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        // Short timeout to fail fast
        signal: AbortSignal.timeout(2000)
      });
      
      if (!response.ok) {
        throw new Error(`API health check failed with status ${response.status}`);
      }
      
      this.useFallback = false;
      console.log("MongoDB API is available");
    } catch (error) {
      console.log("MongoDB API is not available, using localStorage fallback");
      this.useFallback = true;
      toast.info("Using local data (MongoDB not available)", {
        id: "mongodb-fallback",
        duration: 5000,
      });
    }
  }
  
  // Helper method to handle API requests
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // If we already know API is unavailable, use localStorage directly
    if (this.useFallback) {
      return this.localStorageFallback<T>(endpoint, options);
    }
    
    try {
      const url = `${this.apiUrl}/${endpoint}`;
      console.log(`Making request to: ${url}`);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        // Add timeout to prevent long waiting times
        signal: AbortSignal.timeout(5000)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error(`API request failed: ${error}`);
      
      // Set fallback mode on for future requests
      if (!this.useFallback) {
        this.useFallback = true;
        toast.info("Using local data (MongoDB not available)", {
          id: "mongodb-fallback",
          duration: 5000,
        });
      }
      
      // Use localStorage fallback
      return this.localStorageFallback<T>(endpoint, options);
    }
  }
  
  // Fallback to use localStorage when API is unavailable
  private localStorageFallback<T>(endpoint: string, options: RequestInit = {}): T {
    console.log("Using localStorage fallback for:", endpoint);
    
    // Extract collection name from endpoint (e.g., 'problems' from 'problems')
    const collection = endpoint.split('/')[0];
    
    if (options.method === 'GET' || !options.method) {
      // GET request
      const data = localStorage.getItem(collection);
      
      if (collection === 'problems' && (!data || JSON.parse(data).length === 0)) {
        // Create sample data for problems if none exists
        const sampleProblems = [
          {
            id: 1,
            title: "DNA Sequence Alignment",
            slug: "dna-sequence-alignment",
            difficulty: "medium",
            category: "dynamic-programming",
            description: "Given two DNA sequences, find the optimal alignment that minimizes the number of mismatches and gaps.",
            examples: [
              {
                input: "ACGTACGT\nACGGACGT",
                output: "2",
                explanation: "There are 2 operations needed: 1 insertion and 1 substitution."
              }
            ],
            constraints: [
              "1 <= sequence length <= 1000",
              "Sequences contain only A, C, G, T characters"
            ],
            starterCode: {
              javascript: "function alignSequences(seq1, seq2) {\n  // Your code here\n  return minimumOperations;\n}"
            }
          },
          {
            id: 2,
            title: "Protein Folding Prediction",
            slug: "protein-folding-prediction",
            difficulty: "hard",
            category: "combinatorial-algorithms",
            description: "Implement a simple algorithm to predict the 2D folding structure of a protein sequence using a hydrophobic-polar model.",
            examples: [
              {
                input: "HPHPPHHPHPPHPHHPPHPH",
                output: "9",
                explanation: "The maximum number of H-H contacts possible is 9."
              }
            ],
            constraints: [
              "5 <= sequence length <= 100",
              "Sequence contains only H (hydrophobic) and P (polar) characters"
            ],
            starterCode: {
              javascript: "function predictFolding(sequence) {\n  // Your code here\n  return maxContacts;\n}"
            }
          },
          {
            id: 3,
            title: "Gene Expression Clustering",
            slug: "gene-expression-clustering",
            difficulty: "medium",
            category: "machine-learning",
            description: "Implement a k-means clustering algorithm to group genes with similar expression patterns across multiple experiments.",
            examples: [
              {
                input: "3\n5\n1.2,2.3,3.1,4.5,1.0\n5.6,4.2,3.7,2.1,6.0\n2.3,1.8,3.5,4.2,2.0\n7.1,6.5,5.9,8.2,7.0",
                output: "[[0,2],[1,3]]",
                explanation: "Genes 0 and 2 form one cluster, and genes 1 and 3 form another."
              }
            ],
            constraints: [
              "2 <= k <= 10",
              "2 <= number of genes <= 100",
              "1 <= number of experiments <= 20"
            ],
            starterCode: {
              javascript: "function clusterGenes(k, geneExpressions) {\n  // Your code here\n  return clusters;\n}"
            }
          }
        ];
        localStorage.setItem('problems', JSON.stringify(sampleProblems));
        return sampleProblems as unknown as T;
      }
      
      // Handle ID or slug-based requests
      const idMatch = endpoint.match(/\/(\w+)$/);
      const slugMatch = endpoint.match(/\/slug\/([a-z0-9-]+)$/);
      
      if (idMatch) {
        // Get by ID
        const id = idMatch[1];
        const items = data ? JSON.parse(data) : [];
        // Use strict comparison for ID - convert both to strings first
        const item = items.find((item: any) => String(item.id) === String(id));
        console.log(`Looking for item with ID: ${id}, found:`, item);
        return item as unknown as T;
      } else if (slugMatch) {
        // Get by slug
        const slug = slugMatch[1];
        const items = data ? JSON.parse(data) : [];
        const item = items.find((item: any) => item.slug === slug);
        return item as unknown as T;
      }
      
      return data ? JSON.parse(data) : [] as unknown as T;
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
          String(item.id) === String(id) ? updatedItem : item
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
          String(item.id) !== String(id)
        );
        
        localStorage.setItem(collection, JSON.stringify(updatedItems));
        return {} as T;
      }
    }
    
    return {} as T;
  }
  
  // Problems
  async getProblems() {
    console.log("Fetching all problems");
    return this.request<any[]>('problems');
  }
  
  async getProblemById(id: number) {
    console.log(`Fetching problem with ID: ${id}`);
    return this.request<any>(`problems/${id}`);
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
  
  async getSubmissionsByProblemId(problemId: number) {
    const allSubmissions = await this.getSubmissions();
    return allSubmissions.filter((submission: any) => 
      submission.problemId === problemId
    );
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
