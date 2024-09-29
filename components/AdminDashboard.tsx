import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../pages/_app'
import saveRestaurantConfigToFirebase from '../services/saveRestaurantConfig';



const AdminDashboard = ({ restaurantId }) => {
  const [theme, setTheme] = useState({});
  const [content, setContent] = useState({});
  const [menu, setMenu] = useState([]);
  const [config, setConfig] = useState(restaurantId);

  useEffect(() => {

    const fetchConfig = async () => {
      try {
        const docRef = doc(db, 'restaurants', restaurantId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTheme(data.theme || {});
          setContent(data.content || {});
          setMenu(data.menu || []);
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching configuration:', error);
      }
    };

    fetchConfig();
  }, [restaurantId]);

  const handleThemeChange = (e) => {
    setTheme({ ...theme, [e.target.name]: e.target.value });
  };

  const handleContentChange = (e) => {
    setContent({ ...content, [e.target.name]: e.target.value });
  };

  

  const handleSaveChanges = async () => {
    try {
      await setDoc(doc(db, 'restaurants', restaurantId), {
        theme,
        content,
        
      });
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  };

  return (
    <div>
      <h2>Customize Your Restaurant Page</h2>

      {/* Theme Customization */}
      <section>
        <h3>Theme Settings</h3>
        <label>Primary Color:</label>
        <input
          type="color"
          name="primaryColor"
          value={theme.primaryColor || '#ffffff'}
          onChange={handleThemeChange}
        />
        <label>Secondary Color:</label>
        <input
          type="color"
          name="secondaryColor"
          value={theme.secondaryColor || '#ffffff'}
          onChange={handleThemeChange}
        />
        <label>Font Family:</label>
        <input
          type="text"
          name="fontFamily"
          value={theme.fontFamily || ''}
          onChange={handleThemeChange}
        />
      </section>

      {/* Content Customization */}
      <section>
        <h3>Page Content</h3>
        <label>Welcome Text:</label>
        <textarea
          name="welcomeText"
          value={content.welcomeText || ''}
          onChange={handleContentChange}
        />
        <label>About Us:</label>
        <textarea
          name="aboutUs"
          value={content.aboutUs || ''}
          onChange={handleContentChange}
        />
      </section>

      {/* Menu Customization */}
     

      <button onClick={handleSaveChanges}>Save Changes</button>
    </div>
  );
};

export default AdminDashboard;