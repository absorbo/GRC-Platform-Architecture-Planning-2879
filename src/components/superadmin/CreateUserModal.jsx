```jsx
// Previous imports remain the same...

const CreateUserModal = ({ onClose }) => {
  const { createUser, users } = useDatabase();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    resellerId: '',
    companyName: '',
    companySize: '',
    industry: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resellers = users.filter(user => user.role === 'reseller');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!formData.firstName || !formData.lastName) {
        throw new Error('First name and last name are required');
      }

      if (!formData.email) {
        throw new Error('Email is required');
      }

      if (!formData.password) {
        throw new Error('Password is required');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Check if email already exists
      const existingUser = users.find(user => user.email === formData.email);
      if (existingUser) {
        throw new Error('Email already exists');
      }

      // Create user
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        ...(formData.role === 'customer' && formData.resellerId && {
          resellerId: formData.resellerId
        }),
        ...(formData.role === 'customer' && {
          companyName: formData.companyName,
          companySize: formData.companySize,
          industry: formData.industry
        })
      };

      const newUser = await createUser(userData);
      console.log('Created user:', newUser);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Rest of the component remains the same...
};

export default CreateUserModal;
```