import { OAuthProvider } from "appwrite";

interface UserPropes {
  username: string,
  userId: string,
  userCredit: number
}

export const useAuth = () => {

  const { $appwrite } = useNuxtApp();

  const { listOfMcqPaper, pageNumber, hasMoreMcqs } = useMcqList();

  const user = useState<UserPropes | null>('user', () => null);
  const loading = ref(false);
  const error = ref<String | null>(null);

  // register user
  const registerUser = async ({ username, email, password }: { username: string, email: string, password: string }) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await fetch(`/backendApi/api/v1/users/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            username,
            email,
            password
          })
        }
      );

      const backEndRespose = await response.json();

      if (!response.ok) {
        throw new Error(backEndRespose.message || 'Creating Account Failed try after some time.');
      }


      return backEndRespose;
    } catch (err) {
      error.value = String(err)
      user.value = null
      throw err
    } finally {
      loading.value = false
    }
  }

  // login user
  const login = async ({ email, password }: { email: string, password: string }) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await fetch(`/backendApi/api/v1/users/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const backEndRespose = await response.json();

      if (!response.ok) {
        throw new Error(backEndRespose.message || 'Login Failed.');
      }

      const userDetails = {
        username: backEndRespose.data.userName,
        userId: backEndRespose.data.uid,
        userCredit: backEndRespose.data.userCredit,
      };

      user.value = userDetails;


      return backEndRespose;
    } catch (err) {
      error.value = String(err)
      user.value = null
      throw err
    } finally {
      loading.value = false
    }
  }

  // LogOut user
  const logout = async () => {
    loading.value = true;
    error.value = null;

    const response = await fetch(`/backendApi/api/v1/users/logout`,
      {
        credentials: 'include'
      }
    );

    const backEndRespose = await response.json();

    if (!response.ok) {
      throw new Error(backEndRespose.message || 'Try to Login.');
    }

    user.value = null;

    listOfMcqPaper.value = [];
    pageNumber.value = 1;
    hasMoreMcqs.value = true;

    $appwrite.account.deleteSessions();

    return backEndRespose;
  }

  // OAuth Login Methods
  const loginWithOAuth = async () => {
    
    try {
      loading.value = true
      error.value = null

      // Create OAuth2 session
      await $appwrite.account.createOAuth2Session(
        OAuthProvider.Google,
        `${window.location.origin}/auth/callback`, // Redirect to our callback handler
        `${window.location.origin}/login`     // Failure redirect
      )
    } catch (err) {
      error.value = String(err)
      throw err
    } finally {
      loading.value = false
    }
  };

  // Handle OAuth callback and backend verification
  const handelOAuthCallback = async () => {
    try {
      loading.value = true;
      error.value = null;

      // Get the current session after OAuth redirect
      const session = await $appwrite.account.getSession('current');

      // Get the user details including provider token
      const currentUser = await $appwrite.account.get();
      const tokens = await $appwrite.account.listSessions();

      // Find the OAuth session that contains the provider's access token
      const oauthSession = tokens.sessions.find(
        session => session.provider === 'google'
      );

      if (!oauthSession) {
        throw new Error('OAuth session not found')
      }

      const response = await fetch(`/backendApi/api/v1/users/auth/google`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            appwriteUserId: currentUser.$id,
            provider: oauthSession.provider,
            email: currentUser.email,
            name: currentUser.name
          })
        }
      );

      if (!response.ok) {
        throw new Error('Backend verification failed');
      }

      const backEndRespose = await response.json();

      const userDetails = {
        username: backEndRespose.data.userName,
        userId: backEndRespose.data.uid,
        userCredit: backEndRespose.data.userCredit,
      };

      user.value = userDetails;

      return user.value;
    } catch (err) {
      error.value = String(err);
      user.value = null;
      throw err;
    } finally {
      loading.value = false
    }
  };

  // refesh Tokenes
  const refeshToken = async () => {
    try {
      loading.value = true;
      error.value = null;

      const response = await fetch(`/backendApi/api/v1/users/refreshToken`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      );

      const backEndRespose = await response.json();


      const userDetails = {
        username: backEndRespose.data.userName,
        userId: backEndRespose.data.uid,
        userCredit: backEndRespose.data.userCredit || 0,
      };

      user.value = userDetails;

      return backEndRespose;
    } catch (err) {
      error.value = String(err);
      user.value = null;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    user,
    loading,
    error,
    loginWithOAuth,
    handelOAuthCallback,
    login,
    logout,
    registerUser,
    refeshToken
  }
}