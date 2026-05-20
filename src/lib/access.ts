export function accountAccessWhere(userId: string) {
    return {
        OR: [
            { ownerId: userId},
            {
                household: {
                    members: {
                        some: { userId },
                    },
                },
            },
        ],
    };
}

export function nestedAccountAccessWhere(userId: string) {
    return {
        account: accountAccessWhere(userId),
    }
}