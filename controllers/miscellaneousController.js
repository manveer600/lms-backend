import User from "../models/user.model.js"

export const userStats = async(req,res) => {
    console.log(req.user);
    const allUserCounts = await User.countDocuments();

    const subscribedUsersCount = await User.countDocuments({
        "subscription.status":"active"
    })

    console.log(subscribedUsersCount);
    return res.status(200).json({
        success:true,
        message:'All registered users count',
        allUserCounts,
        subscribedUsersCount
    });
}

export const contactUs = async (req, res) => {
    const { name, email, message } = req.body;
    console.log(name);
    console.log(email);
    console.log(message);
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: 'Every field is required',
        });
    }

    try {
        const user = await User.create({
            name,
            email,
            message,
        });

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Message saved successfully',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Error saving message to the database',
            error: error.message,
        });
    }
};
