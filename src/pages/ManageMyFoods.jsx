import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '../../firebase.init';
import { toast } from 'react-toastify';

const ManageMyFoods = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [myFoods, setMyFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState({
    foodName: '',
    foodImage: '',
    foodQuantity: '',
    pickupLocation: '',
    expiredDate: '',
    additionalNotes: '',
    foodStatus: 'available',
    isUrgent: false, 
  });

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingFoodId, setDeletingFoodId] = useState(null);

  const fetchMyFoods = useCallback(async (userId) => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/api/my-foods?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch your food items.');
      }
      const data = await response.json();
      setMyFoods(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchMyFoods(currentUser.uid);
      } else {
        setUser(null);
        setMyFoods([]);
        setIsLoading(false);
        navigate('/login'); 
      }
    });
    return () => unsubscribe();
  }, [auth, navigate, fetchMyFoods]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openUpdateModal = (food) => {
    setEditingFood(food);
    setFormData({
      foodName: food.foodName,
      foodImage: food.foodImage,
      foodQuantity: food.foodQuantity.toString(),
      pickupLocation: food.pickupLocation,
      expiredDate: food.expiredDate ? new Date(food.expiredDate).toISOString().split('T')[0] : '',
      additionalNotes: food.additionalNotes || '',
      foodStatus: food.foodStatus,
      isUrgent: food.isUrgent || false, 
    });
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setEditingFood(null);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingFood || !user) return;

    const updatedFoodPayload = {
      ...formData,
      foodQuantity: parseInt(formData.foodQuantity, 10),
      userId: user.uid, 
    };

    try {
      const response = await fetch(`http://localhost:3000/api/foods/${editingFood._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFoodPayload),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to update food item.');
      }
      toast.success('Food item updated successfully!');
      fetchMyFoods(user.uid); 
      closeUpdateModal();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const openDeleteConfirm = (foodId) => {
    setDeletingFoodId(foodId);
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setDeletingFoodId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingFoodId || !user) return;
    try {
      const response = await fetch(`http://localhost:3000/api/foods/${deletingFoodId}?userId=${user.uid}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to delete food item.');
      }
      toast.success('Food item deleted successfully!');
      setMyFoods(prevFoods => prevFoods.filter(food => food._id !== deletingFoodId));
      closeDeleteConfirm();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
  }
  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }
  if (!user) {
    return <div className="text-center py-10">Please log in to manage your foods.</div>; 
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Manage My Foods</h1>
      {myFoods.length === 0 ? (
        <p className="text-center text-xl">You haven't added any food items yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Expires</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myFoods.map(food => (
                <tr key={food._id}>
                  <td>
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={food.foodImage} alt={food.foodName} />
                      </div>
                    </div>
                  </td>
                  <td>{food.foodName}</td>
                  <td>{food.foodQuantity}</td>
                  <td><span className={`badge ${food.foodStatus === 'available' ? 'badge-success' : 'badge-warning'}`}>{food.foodStatus}</span></td>
                  <td>{food.expiredDate ? new Date(food.expiredDate).toLocaleDateString() : 'N/A'}</td>
                  <td className="space-x-2">
                    <button onClick={() => openUpdateModal(food)} className="btn btn-sm btn-info">Update</button>
                    <button onClick={() => openDeleteConfirm(food._id)} className="btn btn-sm btn-error">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      
      {isUpdateModalOpen && editingFood && (
        <dialog id="update_food_modal" className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeUpdateModal}>✕</button>
            </form>
            <h3 className="font-bold text-lg mb-4">Update Food: {editingFood.foodName}</h3>
            <form onSubmit={handleUpdateSubmit} className="space-y-3">
              <div>
                <label className="label"><span className="label-text">Food Name</span></label>
                <input type="text" name="foodName" value={formData.foodName} onChange={handleInputChange} required className="input input-bordered w-full" />
              </div>
              <div>
                <label className="label"><span className="label-text">Food Image URL</span></label>
                <input type="url" name="foodImage" value={formData.foodImage} onChange={handleInputChange} required className="input input-bordered w-full" />
              </div>
              <div>
                <label className="label"><span className="label-text">Quantity</span></label>
                <input type="number" name="foodQuantity" value={formData.foodQuantity} onChange={handleInputChange} required min="0" className="input input-bordered w-full" />
              </div>
              <div>
                <label className="label"><span className="label-text">Pickup Location</span></label>
                <input type="text" name="pickupLocation" value={formData.pickupLocation} onChange={handleInputChange} required className="input input-bordered w-full" />
              </div>
              <div>
                <label className="label"><span className="label-text">Expired Date</span></label>
                <input type="date" name="expiredDate" value={formData.expiredDate} onChange={handleInputChange} required className="input input-bordered w-full" />
              </div>
               <div>
                <label className="label"><span className="label-text">Food Status</span></label>
                <select name="foodStatus" value={formData.foodStatus} onChange={handleInputChange} className="select select-bordered w-full">
                    <option value="available">Available</option>
                    <option value="requested">Requested</option>
                    
                </select>
              </div>
              <div>
                <label className="label"><span className="label-text">Additional Notes</span></label>
                <textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleInputChange} className="textarea textarea-bordered w-full" rows="3"></textarea>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Mark as Urgent</span>
                  <input
                    type="checkbox"
                    name="isUrgent" // Add name attribute
                    checked={formData.isUrgent}
                    onChange={(e) => setFormData(prev => ({ ...prev, isUrgent: e.target.checked }))}
                    className="checkbox checkbox-warning"
                  />
                </label>
              </div>
              <div className="modal-action mt-4">
                <button type="button" className="btn" onClick={closeUpdateModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
           <form method="dialog" className="modal-backdrop"> <button onClick={closeUpdateModal}>close</button></form>
        </dialog>
      )}

      
      {isDeleteConfirmOpen && (
         <dialog id="delete_confirm_modal" className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Confirm Deletion</h3>
                <p className="py-4">Are you sure you want to delete this food item? This action cannot be undone.</p>
                <div className="modal-action">
                    <button className="btn" onClick={closeDeleteConfirm}>Cancel</button>
                    <button className="btn btn-error" onClick={handleDeleteConfirm}>Delete</button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop"> <button onClick={closeDeleteConfirm}>close</button></form>
        </dialog>
      )}
    </div>
  );
};

export default ManageMyFoods;