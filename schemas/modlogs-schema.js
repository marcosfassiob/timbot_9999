const mongoose = require('mongoose');
const modlogsSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    caseNumber: {
        type: Number,
    }
})

module.exports = mongoose.model('modlogs', modlogsSchema)

        /*
        //modlogs
        const modlogs = async (guildId, userId, authorId, type, reason, caseNumber) => {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            }).then(async () => {
                try {
                    const modlog = await modlogsSchema.findOneAndUpdate({ 
                        guildId, 
                        userId 
                    }, 
                    {
                        guildId,
                        userId,
                        authorId,
                        type,
                        reason,
                        $inc: {
                            caseNumber: 1
                        }
                    }, 
                    {
                        upsert: true,
                    })
                    console.log(modlog)

                    await new modlogsSchema(
                        {
                            guildId,
                            userId,
                            authorId,
                            type,
                            reason,
                            caseNumber: caseNumber + 1
                        }
                    ).save()
                } catch (err) {
                    console.log(err)
                } finally {
                    mongoose.connection.close();
                }
            });
        }
        */