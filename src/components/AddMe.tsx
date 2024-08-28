'use client'

import React, { useEffect, useState } from 'react'
import { validateUserInput } from '@/utils/helper'
import { errorNotification, successNotification } from '@/utils/notification'
import {
  User,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  validatePassword,
} from 'firebase/auth'
import auth from '@/utils/auth'
import {
  DATA_FIELD,
  SCHEDULE_COLLECTION_NAME,
  SCHEDULE_DOC_NAME,
  STORED_EMAIL,
  USER_COLLECTION_NAME,
} from '@/utils/constants'
import { FirebaseError } from 'firebase/app'
import { setDoc, doc, getDoc } from 'firebase/firestore'
import db from '@/utils/firestore'

type Props = {
  toggleSidebar: () => void
}

const AddMe = ({ toggleSidebar }: Props) => {
  const [currentUser, setCurrentUser] = useState<User | null>()

  useEffect(() => {
    setCurrentUser(auth.currentUser)
  }, [auth.currentUser])

  const addUser = async () => {
    const name = prompt('Please enter your name')
    const email = prompt('Please enter your email') as string
    const password = prompt('Please enter password') as string

    try {
      if (!validateUserInput(name, email)) {
        errorNotification('Invalid user input')
        return
      }

      const isValidPassword = await validatePassword(auth, password)
      if (!isValidPassword) {
        errorNotification('Invalid password')
        return
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user

      window.localStorage.setItem(STORED_EMAIL, email)
      await setDoc(doc(db, USER_COLLECTION_NAME, user.uid), {
        name,
        email,
      })

      successNotification(`User: ${name} is added successfully`)

      await sendEmailVerification(user)

      let team: any[] = []
      const docRef = doc(db, SCHEDULE_COLLECTION_NAME, SCHEDULE_DOC_NAME)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()?.[DATA_FIELD]
        if (Array.isArray(data)) {
          team = [...data]
        }
      }

      await setDoc(doc(db, SCHEDULE_COLLECTION_NAME, SCHEDULE_DOC_NAME), {
        [DATA_FIELD]: [...team, name],
      })
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
          window.localStorage.setItem(STORED_EMAIL, email)
          successNotification('Successfully signed in.')
        } else {
          console.error(error.cause, error.message)
          errorNotification(error.message)
        }
      } else {
        console.error(error)
        errorNotification(
          'Something went wrong while adding you. Please try again later.'
        )
      }
    }
  }

  const verifyUser = async () => {
    if (currentUser && !currentUser.emailVerified) {
      sendEmailVerification(currentUser)
      successNotification('Please check your mail.')
    }
  }

  if (!currentUser) {
    return (
      <div
        role="button"
        onClick={addUser}
        className="fixed bottom-6 right-4 md:right-28 md:top-8"
      >
        <button className="hidden rounded-md border px-4 py-2 md:block">
          Add Me
        </button>
        <button className="h-12 w-12 rounded-full border text-xl md:hidden">
          +
        </button>
      </div>
    )
  } else if (!currentUser.emailVerified) {
    return (
      <div
        role="button"
        onClick={verifyUser}
        className="fixed bottom-6 right-4 md:right-28 md:top-8"
      >
        <button className="hidden rounded-md border px-4 py-2 md:block">
          Verify
        </button>
        <button className="h-12 w-12 rounded-full border text-xl md:hidden">
          @
        </button>
      </div>
    )
  } else {
    return (
      <div
        role="button"
        onClick={toggleSidebar}
        className="fixed bottom-6 right-4 md:right-28 md:top-8"
      >
        <button className="hidden rounded-md border px-4 py-2 md:block">
          Activity
        </button>
        <button className="h-12 w-12 rounded-full border text-xl md:hidden">
          #
        </button>
      </div>
    )
  }
}

export default AddMe
