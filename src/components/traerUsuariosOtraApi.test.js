// Mock the fetch API
global.fetch = jest.fn();

describe('traerUsuariosOtraApi', () => {
  let isLoading, setIsLoading, setUsers, traerUsuariosOtraApi;

  beforeEach(() => {
    // Mock state and setState functions
    isLoading = false;
    setIsLoading = jest.fn();
    setUsers = jest.fn();

    // Mock console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock setTimeout
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');

    // Define the traerUsuariosOtraApi function
    traerUsuariosOtraApi = async () => {
      if (isLoading) return;
      setIsLoading(true);
      setUsers([]); // Clear previous users

      try {
        const response = await fetch(`https://dummyjson.com/users`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        const data = await response.json();
        setUsers(data.users); // Store the fetched users
      } catch (error) {
        console.error(`Error en traerUsuariosOtraApi: ${error.message}`);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks(); // Restore console.error and setTimeout
  });

  it('should fetch and set users correctly', async () => {
    // Mock fetch response
    const mockUsers = [
      {
        id: 1,
        firstName: 'Emily',
        lastName: 'Johnson',
        email: 'emily.johnson@x.dummyjson.com',
        phone: '+81 965-431-3024',
        address: { country: 'United States' },
        image: 'https://dummyjson.com/icon/emilys/128',
      },
    ];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ users: mockUsers }),
    });

    // Execute the function
    await traerUsuariosOtraApi();

    // Assertions
    expect(fetch).toHaveBeenCalledWith('https://dummyjson.com/users');
    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(setUsers).toHaveBeenCalledWith([]); // Clear previous users
    expect(setUsers).toHaveBeenCalledWith(mockUsers); // Set fetched users
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 500);

    // Fast-forward timers to ensure setTimeout is executed
    jest.runAllTimers();
    expect(setIsLoading).toHaveBeenCalledWith(false);
  });

  it('should handle fetch errors', async () => {
    // Mock fetch to throw an error
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    // Execute the function
    await traerUsuariosOtraApi();

    // Assertions
    expect(fetch).toHaveBeenCalledWith('https://dummyjson.com/users');
    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(setUsers).toHaveBeenCalledWith([]); // Clear previous users
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error en traerUsuariosOtraApi'));

    // Fast-forward timers to ensure setTimeout is executed
    jest.runAllTimers();
    expect(setIsLoading).toHaveBeenCalledWith(false);
  });
});