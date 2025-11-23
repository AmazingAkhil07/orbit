---
description: How to merge changes from a friend's forked repository
---

Since your friend has a **fork**, they cannot push directly to your repository. You have two ways to get their changes:

### Option 1: The GitHub Way (Recommended)
1.  Ask your friend to go to their repository on GitHub.
2.  Click **"Contribute"** -> **"Open Pull Request"**.
3.  You will see a notification on your repository.
4.  Go to the **"Pull Requests"** tab and click **"Merge"**.

### Option 2: The Terminal Way (Manual)
If you want to merge it manually from your computer:

1.  **Add their fork as a remote:**
    ```bash
    git remote add friend https://github.com/THEIR_USERNAME/orbit.git
    ```

2.  **Download their changes:**
    ```bash
    git fetch friend
    ```

3.  **Merge their code:**
    ```bash
    git checkout main
    git merge friend/main
    ```
    *(Fix any conflicts if they happen)*

4.  **Push to your repository:**
    ```bash
    git push origin main
    ```
