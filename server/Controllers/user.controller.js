import User from "../Models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Failed To Get Current User" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(404)
      .json({ message: `get Current user Error: ${error}` });
  }
};

export const saveAssistant = async (req, res) => {
  try {
    const {
      assistantName,
      businessName,
      businessType,
      businessDescription,
      tone,
      theme,
      geminiApiKey,
      pages,
      enableVoice,
      enableNavigation,
      isSetupComplete,
    } = req.body;

    // Get authenticated user ID
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in first.",
      });
    }

    // Find current user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Failed to get current user.",
      });
    }

    // Update assistant settings only when a field is provided
    if (assistantName !== undefined) {
      user.assistantName = assistantName;
    }
    if (pages !== undefined) user.pages = pages;
    if (enableVoice !== undefined) user.enableVoice = enableVoice;
    if (enableNavigation !== undefined) {
      user.enableNavigation = enableNavigation;
    }
    if (isSetupComplete !== undefined) {
      user.isSetupComplete = isSetupComplete;
    }

    if (businessName !== undefined) {
      user.businessName = businessName;
    }

    if (businessType !== undefined) {
      user.businessType = businessType;
    }

    if (businessDescription !== undefined) {
      user.businessDescription = businessDescription;
    }

    if (tone !== undefined) {
      user.tone = tone;
    }

    if (theme !== undefined) {
      user.theme = theme;
    }


    // Update API key only if a non-empty key is provided
    if (typeof geminiApiKey === "string" && geminiApiKey.trim()) {
      user.geminiApiKey = geminiApiKey.trim();
    }

    // Mark assistant setup as completed

    // Save changes
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Assistant settings saved successfully.",
      user: {
        _id: user._id,
        assistantName: user.assistantName,
        businessName: user.businessName,
        businessType: user.businessType,
        businessDescription: user.businessDescription,
        tone: user.tone,
        theme: user.theme,
        pages: user.pages,
        isSetupComplete: user.isSetupComplete,
      },
    });
  } catch (error) {
    console.error("Save Assistant Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save assistant settings.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
