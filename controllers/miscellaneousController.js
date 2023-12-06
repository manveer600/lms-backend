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