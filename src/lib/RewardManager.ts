import prisma, { where, FindOrCreateUser } from "../lib/db";
import { addExpInteraction } from './LevelSystem'
import { addBadge } from './BadgeSystem'

export default async function (interaction: any, rewardId: Number) {
    const reward = await prisma.reward.findFirst(where({ id: rewardId }));
    if (reward == null) { console.log(reward);return false }

    await FindOrCreateUser(interaction.user);

    addExpInteraction(interaction, reward.exp);

    if (reward.badge !== null) {
        addBadge(interaction, reward.badge)
    }

    return reward;
}