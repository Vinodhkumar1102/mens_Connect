const UserProfile = require('../models/UserProfile');

exports.saveProfile = async (req, res) => {
  try {
    console.log('📥 RECEIVED BODY:', req.body);
    console.log('📥 RECEIVED FILE:', req.file);

    const fullName = req.body?.fullName || '';
    const phone = req.body?.phone || '';
    const gender = req.body?.gender || '';
    const dob = req.body?.dob || '';
    let avatar = req.body?.avatar || null;

    console.log('📋 Extracted data:', { fullName, phone, gender, dob, avatar });

    if (!phone || phone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Valid 10-digit phone required',
      });
    }

    const updateData = {
      fullName,
      phone,
      gender,
      dob,
    };

    console.log('💾 Update data before avatar:', updateData);

    // 📸 avatar - accept from file upload OR from request body
    if (req.file) {
      updateData.avatar = `/uploads/avatars/${req.file.filename}`;
    } else if (avatar) {
      // Avatar from request body (e.g., image URI from React Native)
      updateData.avatar = avatar;
    }

    console.log('💾 Final update data:', updateData);

    const profile = await UserProfile.findOneAndUpdate(
      { phone },
      updateData,
      { upsert: true, new: true, runValidators: true }
    );

    console.log('✅ Profile saved:', profile);

    // Convert avatar path to full URL if it exists
    let profileData = profile.toObject ? profile.toObject() : profile;
    if (profileData.avatar && profileData.avatar.startsWith('/uploads/')) {
      profileData.avatar = `http://localhost:4000${profileData.avatar}`;
    }
    console.log('✅ Avatar URL from backend:', profileData.avatar);

    res.json({
      success: true,
      message: 'Profile saved successfully',
      data: profileData,
    });
  } catch (err) {
    console.error('❌ Error in saveProfile:', err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// 📤 Upload Avatar
exports.uploadAvatar = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || phone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Phone number required',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image uploaded',
      });
    }

    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    const avatarUrl = `http://localhost:4000${avatarPath}`;

    const profile = await UserProfile.findOneAndUpdate(
      { phone },
      { avatar: avatarPath },
      { new: true }
    );

    let profileData = profile.toObject ? profile.toObject() : profile;
    profileData.avatar = avatarUrl;
    console.log('✅ Avatar URL from backend:', avatarUrl);

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatar: avatarUrl,
      data: profileData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    console.log('UPDATE BODY:', req.body);
    console.log('UPDATE FILE:', req.file);

    const { phone } = req.params;

    if (!phone || phone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Valid phone number required',
      });
    }

    const updateData = {};

    if (req.body?.fullName !== undefined)
      updateData.fullName = req.body.fullName;

    if (req.body?.gender !== undefined)
      updateData.gender = req.body.gender;

    if (req.body?.dob !== undefined)
      updateData.dob = req.body.dob;

    if (req.body?.emergency !== undefined)
      updateData.emergency = req.body.emergency;

    // 📸 avatar update
    if (req.file) {
      updateData.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    const updated = await UserProfile.findOneAndUpdate(
      { phone },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    // Convert avatar path to full URL if it exists
    let profileData = updated.toObject ? updated.toObject() : updated;
    if (profileData.avatar && profileData.avatar.startsWith('/uploads/')) {
      profileData.avatar = `http://localhost:4000${profileData.avatar}`;
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: profileData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



// 📄 Get Profile by Phone
exports.getProfile = async (req, res) => {
  try {
    const { phone } = req.params;

    const profile = await UserProfile.findOne({ phone });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    // Convert avatar path to full URL if it exists
    let profileData = profile.toObject ? profile.toObject() : profile;
    if (profileData.avatar && profileData.avatar.startsWith('/uploads/')) {
      profileData.avatar = `http://localhost:4000${profileData.avatar}`;
      console.log('✅ Avatar URL from backend:', profileData.avatar);
    }

    res.json({ success: true, data: profileData });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ✅ GET ALL USER PROFILES (ADMIN)
exports.getAllProfiles = async (req, res) => {
  try {
    const users = await UserProfile.find() // DO NOT filter isActive
      .sort({ createdAt: -1 });

    // Convert avatar paths to full URLs
    const usersWithUrls = users.map(user => {
      let userData = user.toObject ? user.toObject() : user;
      if (userData.avatar && userData.avatar.startsWith('/uploads/')) {
        userData.avatar = `http://localhost:4000${userData.avatar}`;
      }
      return userData;
    });

    res.json({
      success: true,
      count: usersWithUrls.length,
      data: usersWithUrls,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ❌ Delete Profile (Soft delete)
// ❌ HARD DELETE PROFILE (PERMANENT DELETE)
exports.deleteProfile = async (req, res) => {
  try {
    const { phone } = req.params;

    if (!phone || phone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Valid phone number required',
      });
    }

    const deletedUser = await UserProfile.findOneAndDelete({ phone });

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User deleted permanently from database',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

