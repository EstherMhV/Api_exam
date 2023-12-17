/**
 * @swagger
 * /groups:
 *   get:
 *     summary: Retrieve a list of groups
 *     responses:
 *       200:
 *         description: A list of groups.
 */

/**
 * @swagger
 * /groups/invite:
 *   post:
 *     summary: Invite user to a  group
 *     responses:
 *       200:
 *         description: Invite user to a groupe group.
 */

/**
 * @swagger
 * /groups/{id_group}:
*   put:
*     summary: Update a group
*     parameters:
*       - in: path
*         name: id_group
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: The updated group.
*   get:
*     summary: Retrieve a group
*     parameters:
*       - in: path
*         name: id_group
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: The retrieved group.
*   delete:
*     summary: Delete a group
*     parameters:
*       - in: path
*         name: id_group
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: The deleted group.
*/

/**
 * @swagger
 * /groups/:id_group/acceptInvite:
 *   post:
 *     summary: User accept the invitation to the group
 *     responses:
 *       200:
 *         description: User accept the invitation to the group.
 */


/**
 * @swagger
 * /groups/:id_group/declineInvite:
 *   post:
 *     summary: User decline the invitation to the group
 *     responses:
 *       200:
 *         description:User decline the invitation to the group.
 */

/**
 * @swagger
 * /groups/:id_group/assign:
 *   post:
 *     summary: Admin of the group assign secret santa to each members of the group
 *     responses:
 *       200:
 *         description: Admin of the group assign secret santa to each members of the group
 */






/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     responses:
 *       200:
 *         description: The registered user.
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     responses:
 *       200:
 *         description: The logged in user.
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users.
 */

/**
 * @swagger
 * /users/{id_user}:
 *   put:
 *     summary: Update a user
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The updated user.
 *   delete:
 *     summary: Delete a user
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The deleted user.
 *   get:
 *     summary: Retrieve a user
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The retrieved user.
 */
