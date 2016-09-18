using UnityEngine;
using System.Collections;
using SocketIO;

public class NetworkManager : MonoBehaviour {
	public const int SHOW_ARROW_TIME = 2000;

	public GameObject socketObj;
	public AudioClip[] sounds;
	public GameObject leftArrow;
	public GameObject rightArrow;

	private SocketIOComponent mySock;
	private bool isLeftActive = false;
	private bool isRightActive = false;
	private int leftActiveTime = -1;
	private int rightActiveTime = -1;

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
				leftActiveTime = System.DateTime.Now;
			} else if (dir.Equals("right")) {
				rightArrow.SetActive(true);
				isRightActive = true;
				rightActiveTime = System.DateTime.Now;
			}
		});
	}
	
	void Update () {
		if (isLeftActive && System.DateTime.Now > leftActiveTime + SHOW_ARROW_TIME) {
			isLeftActive = false;
			leftArrow.SetActive (false);
		}
		if (isRightActive && System.DateTime.Now > rightActiveTime + SHOW_ARROW_TIME) {
			isRightActive = false;
			rightArrow.SetActive (false);
		}
	}
}
