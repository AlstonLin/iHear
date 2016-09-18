using UnityEngine;
using System.Collections;
using SocketIO;

public class NetworkManager : MonoBehaviour {
	public const int SHOW_ARROW_TIME = 2;

	public GameObject socketObj;
	public AudioClip[] sounds;
	public GameObject leftArrow;
	public GameObject rightArrow;

	private SocketIOComponent mySock;
	private bool isLeftActive = false;
	private bool isRightActive = false;
	private float leftActiveTime = -1;
	private float rightActiveTime = -1;

	void Start () {
		leftArrow.SetActive (false);
		rightArrow.SetActive (false);
		mySock = (SocketIOComponent)socketObj.GetComponent (typeof(SocketIOComponent));
		mySock.On ("say", (SocketIOEvent e) => {
			int num = int.Parse (e.data.GetField("label").ToString());
			if (sounds [num] != null) {
				AudioSource.PlayClipAtPoint (sounds [num], transform.position);
			}
		});
		mySock.On ("sound", (SocketIOEvent e) => {
			string dir = e.data.GetField("dir").ToString();
			if (dir.Equals("left")){
				leftArrow.SetActive(true);
				isLeftActive = true;
				leftActiveTime = Time.time;
			} else if (dir.Equals("right")) {
				rightArrow.SetActive(true);
				isRightActive = true;
				rightActiveTime = Time.time;
			}
		});
	}
	
	void Update () {
		if (isLeftActive && Time.time > leftActiveTime + SHOW_ARROW_TIME) {
			isLeftActive = false;
			leftArrow.SetActive (false);
		}
		if (isRightActive && Time.time > rightActiveTime + SHOW_ARROW_TIME) {
			isRightActive = false;
			rightArrow.SetActive (false);
		}
	}
}
