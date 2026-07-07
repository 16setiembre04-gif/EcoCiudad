export const en = {
  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    done: 'Done',
    close: 'Close',
    search: 'Search',
    noResults: 'No results',
    retry: 'Retry',
  },

  // Auth
  auth: {
    welcome: 'Welcome to EcoCiudad',
    chooseRole: 'Choose your role to get started',
    citizen: 'Citizen',
    operator: 'Operator',
    citizenDescription: 'Report issues, join communities, and earn eco points',
    operatorDescription: 'Manage reports, coordinate routes, and oversee operations',
    changeRole: 'Change Role',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    resetPassword: 'Reset Password',
    resetPasswordSent: 'Reset email sent',
    resetPasswordDescription: 'Enter your email and we\'ll send you a link to reset your password',
    enterEmail: 'Enter your email',
    newPassword: 'New Password',
    updatePassword: 'Update Password',
    passwordUpdated: 'Password updated',
    verifyEmail: 'Verify Email',
    verifyEmailDescription: 'We sent you a verification email. Please check your inbox.',
    resendVerification: 'Resend Verification',
    verificationSent: 'Verification sent',
    noAccount: 'Don\'t have an account?',
    haveAccount: 'Already have an account?',
    invalidCredentials: 'Invalid email or password',
    emailNotVerified: 'Please verify your email before signing in',
    registrationSuccess: 'Registration successful. Please verify your email.',
  },

  // Citizen Login
  citizenLogin: {
    title: 'Welcome Back',
    subtitle: 'Sign in to your citizen account',
  },

  // Operator Login
  operatorLogin: {
    title: 'Welcome Back',
    subtitle: 'Sign in to your operator account',
    employeeId: 'Employee ID',
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome',
    quickActions: 'Quick Actions',
    recentActivity: 'Recent Activity',
    statistics: 'Statistics',
    reports: 'Reports',
    communities: 'Communities',
    events: 'Events',
    recycling: 'Recycling',
    profile: 'Profile',
  },

  // Reports
  reports: {
    title: 'Reports',
    create: 'Create Report',
    myReports: 'My Reports',
    allReports: 'All Reports',
    status: 'Status',
    category: 'Category',
    priority: 'Priority',
    location: 'Location',
    description: 'Description',
    images: 'Images',
    pending: 'Pending',
    inReview: 'In Review',
    resolved: 'Resolved',
    rejected: 'Rejected',
    waste: 'Waste',
    pollution: 'Pollution',
    greenSpace: 'Green Space',
    water: 'Water',
    noise: 'Noise',
    other: 'Other',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
    noReports: 'No reports',
    createFirst: 'Create your first report',
  },

  // Communities
  communities: {
    title: 'Communities',
    join: 'Join',
    leave: 'Leave',
    members: 'Members',
    posts: 'Posts',
    create: 'Create Community',
    myCommunities: 'My Communities',
    allCommunities: 'All Communities',
    public: 'Public',
    private: 'Private',
    noCommunities: 'No communities',
    joinFirst: 'Join your first community',
  },

  // Events
  events: {
    title: 'Events',
    upcoming: 'Upcoming',
    myEvents: 'My Events',
    register: 'Register',
    unregister: 'Unregister',
    attendees: 'Attendees',
    location: 'Location',
    date: 'Date',
    time: 'Time',
    noEvents: 'No events',
    registerFirst: 'Register for your first event',
  },

  // Recycling
  recycling: {
    title: 'Recycling',
    centers: 'Recycling Centers',
    nearby: 'Nearby',
    favorites: 'Favorites',
    materials: 'Materials',
    hours: 'Hours',
    rating: 'Rating',
    noCenters: 'No recycling centers',
  },

  // Profile
  profile: {
    title: 'Profile',
    editProfile: 'Edit Profile',
    settings: 'Settings',
    achievements: 'Achievements',
    ecoPoints: 'Eco Points',
    level: 'Level',
    language: 'Language',
    theme: 'Theme',
    notifications: 'Notifications',
    logout: 'Logout',
    confirmLogout: 'Are you sure you want to logout?',
  },

  // Settings
  settings: {
    title: 'Settings',
    language: 'Language',
    selectLanguage: 'Select Language',
    spanish: 'Spanish',
    english: 'English',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    notifications: 'Notifications',
    enableNotifications: 'Enable Notifications',
    pushNotifications: 'Push Notifications',
    emailNotifications: 'Email Notifications',
    privacy: 'Privacy',
    about: 'About',
    version: 'Version',
  },

  // Errors
  errors: {
    generic: 'Something went wrong. Please try again.',
    network: 'Connection error. Check your internet connection.',
    unauthorized: 'Unauthorized. Please sign in.',
    notFound: 'Resource not found.',
    validation: 'Validation error. Please check the data.',
    server: 'Server error. Please try again later.',
  },

  // Validation
  validation: {
    required: 'This field is required',
    email: 'Invalid email address',
    password: 'Password must be at least 6 characters',
    passwordMatch: 'Passwords do not match',
    minLength: 'Minimum {min} characters',
    maxLength: 'Maximum {max} characters',
  },
};

export default en;
