export const initiateDiscordAuth = () => {
  window.location.href = 'https://codyai.cc/api/auth/discord';
};

export const checkAuthStatus = async () => {
  try {
    const response = await fetch('https://codyai.cc/api/auth/status', {
      credentials: 'include' // Important for sending cookies
    });
    
    if (!response.ok) {
      throw new Error('Failed to check auth status');
    }
    
    const data = await response.json();
    return {
      isAuthenticated: true,
      user: data
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      user: null
    };
  }
};

